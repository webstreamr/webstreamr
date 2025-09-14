import { gunzipSync, gzipSync } from 'zlib';
import { Mutex, Semaphore, SemaphoreInterface, withTimeout } from 'async-mutex';
import { Cacheable, CacheableMemory, Keyv } from 'cacheable';
import CachePolicy from 'http-cache-semantics';
import { Cookie, CookieJar } from 'tough-cookie';
import { fetch, Headers, RequestInit, Response } from 'undici';
import winston from 'winston';
import { BlockedError, HttpError, NotFoundError, QueueIsFullError, TimeoutError, TooManyRequestsError, TooManyTimeoutsError } from '../error';
import { BlockedReason, Context } from '../types';
import { createDispatcher } from './dispatcher';
import { envGet } from './env';

interface HttpCacheItem {
  headers: CachePolicy.Headers;
  status: number;
  statusText: string;
  body: string;
  ttl: number;
}

interface FlareSolverrResult {
  status: string;
  message: string;
  solution: {
    url: string;
    status: number;
    cookies: {
      domain: string;
      expires: number;
      httpOnly: boolean;
      name: string;
      path: string;
      sameSite: string;
      secure: boolean;
      value: string;
    }[];
    userAgent: string;
    headers: Record<string, string>;
    response: string;
  };
  startTimeStamp: number;
  endTimeStamp: number;
  version: string;
}

export type CustomRequestInit = RequestInit & {
  minCacheTtl?: number;
  noCache?: boolean;
  noFlareSolverr?: boolean;
  queueLimit?: number;
  queueTimeout?: number;
  timeout?: number;
  timeoutsCountThrow?: number;
};

export class Fetcher {
  private readonly MIN_CACHE_TTL = 900000; // 15m
  private readonly DEFAULT_TIMEOUT = 10000;
  private readonly DEFAULT_QUEUE_LIMIT = 5;
  private readonly DEFAULT_QUEUE_TIMEOUT = 5000;
  private readonly DEFAULT_TIMEOUTS_COUNT_THROW = 30;
  private readonly TIMEOUT_CACHE_TTL = 3600000; // 1h
  private readonly MAX_WAIT_RETRY_AFTER = 10000;

  private readonly logger: winston.Logger;

  private readonly httpCache = new Cacheable({
    primary: new Keyv({ store: new CacheableMemory({ lruSize: 1024 }) }),
    stats: true,
  });

  private readonly rateLimitedCache = new Cacheable({ primary: new Keyv({ store: new CacheableMemory({ lruSize: 1024 }) }) });
  private readonly semaphores = new Map<string, SemaphoreInterface>();
  private readonly hostUserAgentMap = new Map<string, string>();
  private readonly cookieJar = new CookieJar();

  private readonly timeoutsCountCache = new Cacheable({ primary: new Keyv({ store: new CacheableMemory({ lruSize: 1024 }) }) });
  private readonly timeoutsCountMutex = new Mutex();

  public constructor(logger: winston.Logger) {
    this.logger = logger;
  }

  public stats() {
    return {
      httpCache: this.httpCache.stats,
    };
  };

  public async text(ctx: Context, url: URL, init?: CustomRequestInit): Promise<string> {
    return (await this.cachedFetch(ctx, url, init)).body;
  };

  public async textPost(ctx: Context, url: URL, body: string, init?: CustomRequestInit): Promise<string> {
    return (await this.cachedFetch(ctx, url, { ...init, method: 'POST', body })).body;
  };

  public async head(ctx: Context, url: URL, init?: CustomRequestInit): Promise<CachePolicy.Headers> {
    return (await this.cachedFetch(ctx, url, { ...init, method: 'HEAD' })).headers;
  };

  private getInit(url: URL, init?: CustomRequestInit): CustomRequestInit {
    const cookieString = this.cookieJar.getCookieStringSync(url.href);

    return {
      ...init,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en',
        ...(url.username && { Authorization: 'Basic ' + Buffer.from(`${url.username}:${url.password}`).toString('base64') }),
        'Priority': 'u=0',
        'User-Agent': this.hostUserAgentMap.get(url.host) ?? 'node',
        ...(cookieString && { Cookie: cookieString }),
        ...init?.headers,
      },
    };
  };

  private async handleHttpCacheItem(ctx: Context, httpCacheItem: HttpCacheItem, url: URL, init?: CustomRequestInit): Promise<HttpCacheItem> {
    const triggeredCloudflareTurnstile = httpCacheItem.body.includes('cf-turnstile');

    if (httpCacheItem.status && httpCacheItem.status >= 200 && httpCacheItem.status <= 399 && !triggeredCloudflareTurnstile) {
      return httpCacheItem;
    }

    if (httpCacheItem.status === 404) {
      throw new NotFoundError();
    }

    if (httpCacheItem.headers['cf-mitigated'] === 'challenge' || triggeredCloudflareTurnstile) {
      const noFlareSolverr = init?.noFlareSolverr ?? false;
      const flareSolverrEndpoint = envGet('FLARESOLVERR_ENDPOINT');
      if (noFlareSolverr || !flareSolverrEndpoint) {
        throw new BlockedError(url, BlockedReason.cloudflare_challenge, httpCacheItem.headers);
      }

      this.logger.info(`Query FlareSolverr for ${url.href}`, ctx);

      const body = { cmd: 'request.get', url: url.href, session: 'default' };
      const challengeResult = await (await this.queuedFetch(ctx, new URL(flareSolverrEndpoint), { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, queueLimit: 1, timeout: 15000 })).json() as FlareSolverrResult;
      if (challengeResult.status !== 'ok') {
        this.logger.warn(`FlareSolverr issue: ${JSON.stringify(challengeResult)}`, ctx);
        throw new BlockedError(url, BlockedReason.flaresolverr_failed, {});
      }

      challengeResult.solution.cookies.forEach((cookie) => {
        if (!['cf_clearance'].includes(cookie.name)) {
          return;
        }

        this.cookieJar.setCookie(
          new Cookie({
            key: cookie.name,
            value: cookie.value,
            expires: new Date(cookie.expires * 1000),
            domain: cookie.domain.replace(/^.+/, ''),
          }),
          url.href,
        );
      });

      this.hostUserAgentMap.set(url.host, challengeResult.solution.userAgent);

      httpCacheItem.body = challengeResult.solution.response;

      return httpCacheItem;
    }

    if (httpCacheItem.status === 403) {
      if (ctx.config.mediaFlowProxyUrl && url.href.startsWith(ctx.config.mediaFlowProxyUrl)) {
        throw new BlockedError(url, BlockedReason.media_flow_proxy_auth, httpCacheItem.headers);
      }

      throw new BlockedError(url, BlockedReason.unknown, httpCacheItem.headers);
    }

    if (httpCacheItem.status === 451) {
      throw new BlockedError(url, BlockedReason.cloudflare_censor, httpCacheItem.headers);
    }

    if (httpCacheItem.status === 429) {
      const retryAfter = parseInt(`${httpCacheItem.headers['retry-after']}`);
      if (!isNaN(retryAfter)) {
        await this.rateLimitedCache.set<true>(url.host, true, retryAfter * 1000);
      }

      throw new TooManyRequestsError(retryAfter);
    }

    throw new HttpError(httpCacheItem.status, httpCacheItem.statusText, httpCacheItem.headers);
  };

  private determineCacheKey(url: URL, init?: CustomRequestInit): string {
    return `${url.href}_${init?.body?.toString()}`;
  }

  private determineCacheTtl(status: number, policy: CachePolicy, init?: CustomRequestInit): number {
    if ((status >= 200 && status <= 299) || status === 404) {
      return Math.max(policy.timeToLive(), init?.minCacheTtl ?? this.MIN_CACHE_TTL);
    }

    return 0;
  };

  private async cacheGet(key: string): Promise<HttpCacheItem | undefined> {
    const buffer = await this.httpCache.get<Buffer>(key);

    return buffer ? JSON.parse(gunzipSync(buffer).toString()) : undefined;
  }

  private async cacheSet(key: string, httpCacheItem: HttpCacheItem) {
    if (httpCacheItem.ttl <= 0) {
      return;
    }

    await this.httpCache.set<Buffer>(key, gzipSync(JSON.stringify(httpCacheItem)), httpCacheItem.ttl);
  }

  private headersToObject(headers: Headers): Record<string, string> {
    const obj: Record<string, string> = {};

    headers.forEach((value, name) => {
      obj[name] = value;
    });

    return obj;
  };

  private async cachedFetch(ctx: Context, url: URL, init?: CustomRequestInit): Promise<HttpCacheItem> {
    const newInit = this.getInit(url, init);

    const request: CachePolicy.Request = { url: url.href, method: newInit.method ?? 'GET', headers: {} };

    const cacheKey = this.determineCacheKey(url, init);
    let httpCacheItem = await this.cacheGet(cacheKey);
    const noCache = init?.noCache ?? false;
    if (httpCacheItem && !noCache) {
      this.logger.info(`Cached fetch ${request.method} ${url}`, ctx);
      return this.handleHttpCacheItem(ctx, httpCacheItem, url, init);
    }

    const response = await this.queuedFetch(ctx, url, newInit);
    const body = await response.text();

    const policy = new CachePolicy(request, { status: response.status, headers: this.headersToObject(response.headers) }, { shared: false });
    const ttl = this.determineCacheTtl(response.status, policy, init);

    httpCacheItem = { headers: policy.responseHeaders(), status: response.status, statusText: response.statusText, body, ttl };

    await this.cacheSet(cacheKey, httpCacheItem);

    return this.handleHttpCacheItem(ctx, httpCacheItem, url, init);
  };

  protected async fetchWithTimeout(ctx: Context, url: URL, init?: CustomRequestInit, tryCount = 0): Promise<Response> {
    this.logger.info(`Fetch ${init?.method ?? 'GET'} ${url}`, ctx);

    const isRateLimitedRaw = await this.rateLimitedCache.getRaw<true>(url.host);
    /* istanbul ignore if */
    if (isRateLimitedRaw && isRateLimitedRaw.value && isRateLimitedRaw.expires) {
      const ttl = isRateLimitedRaw.expires - Date.now();
      if (ttl <= this.MAX_WAIT_RETRY_AFTER && tryCount < 1) {
        this.logger.info('Wait out rate limit', ctx);

        await this.sleep(ttl);

        return await this.fetchWithTimeout(ctx, url, { ...init, queueLimit: 1 }, ++tryCount);
      }

      throw new TooManyRequestsError((isRateLimitedRaw.expires as number - Date.now()) / 1000);
    }

    const timeouts = (await this.timeoutsCountCache.get<number>(url.host)) ?? 0;
    if (timeouts >= (init?.timeoutsCountThrow ?? this.DEFAULT_TIMEOUTS_COUNT_THROW)) {
      throw new TooManyTimeoutsError();
    }

    let response;
    try {
      const finalUrl = new URL(url.href);
      finalUrl.username = '';
      finalUrl.password = '';

      const dispatcher = createDispatcher(ctx, url);

      const finalInit = {
        ...init,
        keepalive: true,
        signal: AbortSignal.timeout(init?.timeout ?? this.DEFAULT_TIMEOUT),
        ...(/* istanbul ignore next */ dispatcher && { dispatcher }),
      };

      response = await fetch(finalUrl, finalInit);
    } catch (error) {
      if (error instanceof DOMException && ['AbortError', 'TimeoutError'].includes(error.name)) {
        await this.increaseTimeoutsCount(url);
        throw new TimeoutError();
      }

      throw error;
    }

    await this.decreaseTimeoutsCount(url);

    if (response.status === 429) {
      const retryAfter = parseInt(`${response.headers.get('retry-after')}`) * 1000;
      if (retryAfter <= this.MAX_WAIT_RETRY_AFTER && tryCount < 1) {
        this.logger.info(`Wait out rate limit for ${url.host}`, ctx);

        await this.sleep(retryAfter);

        return await this.fetchWithTimeout(ctx, url, { ...init, queueLimit: 1 }, ++tryCount);
      }
    }

    if (response.status >= 500 && tryCount < 3) {
      this.logger.warn(`Retrying fetch ${init?.method ?? 'GET'} ${url} because of error`, ctx);
      await this.sleep(333);

      return await this.fetchWithTimeout(ctx, url, init, ++tryCount);
    }

    return response;
  };

  private async increaseTimeoutsCount(url: URL) {
    await this.timeoutsCountMutex.runExclusive(async () => {
      const count = (await this.timeoutsCountCache.get<number>(url.host)) ?? 0;
      const newCount = count + 1;
      await this.timeoutsCountCache.set<number>(url.host, newCount, this.TIMEOUT_CACHE_TTL);
    });
  }

  private async decreaseTimeoutsCount(url: URL) {
    await this.timeoutsCountMutex.runExclusive(async () => {
      const count = (await this.timeoutsCountCache.get<number>(url.host)) ?? 0;
      const newCount = Math.max(0, count - 1);
      await this.timeoutsCountCache.set<number>(url.host, newCount, this.TIMEOUT_CACHE_TTL);
    });
  }

  private getSemaphore(url: URL, queueLimit: number, queueTimeout: number): SemaphoreInterface {
    let sem = this.semaphores.get(url.host);

    if (!sem) {
      sem = withTimeout(new Semaphore(queueLimit), queueTimeout, new QueueIsFullError());
      this.semaphores.set(url.host, sem);
    }

    return sem;
  }

  private async queuedFetch(ctx: Context, url: URL, init?: CustomRequestInit): Promise<Response> {
    const queueLimit = init?.queueLimit ?? this.DEFAULT_QUEUE_LIMIT;
    const queueTimeout = init?.queueTimeout ?? this.DEFAULT_QUEUE_TIMEOUT;

    const semaphore = this.getSemaphore(url, queueLimit, queueTimeout);

    const [,release] = await semaphore.acquire();

    try {
      return await this.fetchWithTimeout(ctx, url, init);
    } finally {
      release();
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(sleep => setTimeout(sleep, ms));
  }
}
