import { gunzipSync, gzipSync } from 'zlib';
import TTLCache from '@isaacs/ttlcache';
import { Mutex, Semaphore, SemaphoreInterface, withTimeout } from 'async-mutex';
import CachePolicy from 'http-cache-semantics';
import { LRUCache } from 'lru-cache';
import { Cookie, CookieJar } from 'tough-cookie';
import { fetch, Headers, RequestInit, Response } from 'undici';
import winston from 'winston';
import { BlockedError, HttpError, NotFoundError, QueueIsFullError, TimeoutError, TooManyRequestsError, TooManyTimeoutsError } from '../error';
import { BlockedReason, Context } from '../types';
import { envGet } from './env';

interface HttpCacheItem {
  policy: CachePolicy;
  status: number;
  statusText: string;
  body: string;
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
  timeoutsCountThrow?: number;
  noFlareSolverr?: boolean;
  queueLimit?: number;
  queueTimeout?: number;
  timeout?: number;
};

export class Fetcher {
  private readonly MIN_CACHE_TTL = 900000; // 15m
  private readonly DEFAULT_TIMEOUT = 10000;
  private readonly DEFAULT_QUEUE_LIMIT = 5;
  private readonly DEFAULT_QUEUE_TIMEOUT = 5000;
  private readonly DEFAULT_FAILED_REQUEST_COUNT_THROW = 10;
  private readonly TIMEOUT_CACHE_TTL = 3600000; // 1h

  private readonly logger: winston.Logger;

  private readonly httpCache = new LRUCache<string, Buffer>({ max: 1024 });
  private readonly rateLimitedCache = new TTLCache<string, undefined>({ max: 1024 });
  private readonly semaphores = new Map<string, SemaphoreInterface>();
  private readonly hostUserAgentMap = new Map<string, string>();
  private readonly cookieJar = new CookieJar();

  private readonly timeoutsCountCache = new TTLCache<string, number>({ max: 1024 });
  private readonly timeoutsCountMutex = new Mutex();

  public constructor(logger: winston.Logger) {
    this.logger = logger;
  }

  public async text(ctx: Context, url: URL, init?: CustomRequestInit): Promise<string> {
    return (await this.cachedFetch(ctx, url, init)).body;
  };

  public async textPost(ctx: Context, url: URL, body: string, init?: CustomRequestInit): Promise<string> {
    return (await this.cachedFetch(ctx, url, { ...init, method: 'POST', body })).body;
  };

  public async head(ctx: Context, url: URL, init?: CustomRequestInit): Promise<CachePolicy.Headers> {
    return (await this.cachedFetch(ctx, url, { ...init, method: 'HEAD' })).policy.responseHeaders();
  };

  private getInit(ctx: Context, url: URL, init?: CustomRequestInit): CustomRequestInit {
    const cookieString = this.cookieJar.getCookieStringSync(url.href);

    return {
      ...init,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en',
        'Priority': 'u=0',
        'User-Agent': this.hostUserAgentMap.get(url.host) ?? 'node',
        ...(cookieString && { Cookie: cookieString }),
        ...(ctx.ip && {
          'Forwarded': `for=${ctx.ip}`,
          'X-Forwarded-For': ctx.ip,
          'X-Forwarded-Proto': url.protocol.slice(0, -1),
          'X-Real-IP': ctx.ip,
        }),
        ...init?.headers,
      },
    };
  };

  private async handleHttpCacheItem(ctx: Context, httpCacheItem: HttpCacheItem, url: URL, init?: CustomRequestInit): Promise<HttpCacheItem> {
    if (httpCacheItem.status && httpCacheItem.status >= 200 && httpCacheItem.status <= 399) {
      return httpCacheItem;
    }

    if (httpCacheItem.status === 404) {
      throw new NotFoundError();
    }

    const responseHeaders = httpCacheItem.policy.responseHeaders();

    if (httpCacheItem.policy.responseHeaders()['cf-mitigated'] === 'challenge') {
      const noFlareSolverr = init?.noFlareSolverr ?? false;
      const flareSolverrEndpoint = envGet('FLARESOLVERR_ENDPOINT');
      if (noFlareSolverr || !flareSolverrEndpoint) {
        throw new BlockedError(BlockedReason.cloudflare_challenge, httpCacheItem.policy.responseHeaders());
      }

      this.logger.info(`Query FlareSolverr for ${url.href}`, ctx);

      const body = { cmd: 'request.get', url: url.href, session: 'default' };
      const challengeResult = await (await this.queuedFetch(ctx, new URL(flareSolverrEndpoint), { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, queueLimit: 1, timeout: 15000 })).json() as FlareSolverrResult;
      if (challengeResult.status !== 'ok') {
        this.logger.warn(`FlareSolverr issue: ${JSON.stringify(challengeResult)}`, ctx);
        throw new BlockedError(BlockedReason.flaresolverr_failed, {});
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

      this.cacheSet(this.determineCacheKey(url, init), httpCacheItem);

      return httpCacheItem;
    }

    if (httpCacheItem.status === 403) {
      if (ctx.config.mediaFlowProxyUrl && url.href.startsWith(ctx.config.mediaFlowProxyUrl)) {
        throw new BlockedError(BlockedReason.media_flow_proxy_auth, httpCacheItem.policy.responseHeaders());
      }

      throw new BlockedError(BlockedReason.unknown, httpCacheItem.policy.responseHeaders());
    }

    if (httpCacheItem.status === 429) {
      const retryAfter = parseInt(`${httpCacheItem.policy.responseHeaders()['retry-after']}`);
      if (!isNaN(retryAfter)) {
        this.rateLimitedCache.set(url.host, undefined, { ttl: retryAfter * 1000 });
      }

      throw new TooManyRequestsError(retryAfter);
    }

    throw new HttpError(httpCacheItem.status, httpCacheItem.statusText, responseHeaders);
  };

  private determineCacheKey(url: URL, init?: CustomRequestInit): string {
    return `${url.href}_${init?.body?.toString()}`;
  }

  private determineCacheTtl(httpCacheItem: HttpCacheItem): number {
    if (httpCacheItem.status === 200) {
      return Math.max(httpCacheItem.policy.timeToLive(), this.MIN_CACHE_TTL);
    }

    return httpCacheItem.policy.timeToLive();
  };

  private cacheGet(key: string): HttpCacheItem | undefined {
    const buffer = this.httpCache.get(key);

    return buffer ? JSON.parse(gunzipSync(buffer).toString()) : undefined;
  }

  private cacheSet(key: string, httpCacheItem: HttpCacheItem) {
    const ttl = this.determineCacheTtl(httpCacheItem);
    if (ttl <= 0) {
      return;
    }

    this.httpCache.set(key, gzipSync(JSON.stringify(httpCacheItem)), { ttl });
  }

  private headersToObject(headers: Headers): Record<string, string> {
    const obj: Record<string, string> = {};

    headers.forEach((value, name) => {
      obj[name] = value;
    });

    return obj;
  };

  private async cachedFetch(ctx: Context, url: URL, init?: CustomRequestInit): Promise<HttpCacheItem> {
    const newInit = this.getInit(ctx, url, init);

    const request: CachePolicy.Request = { url: url.href, method: newInit.method ?? 'GET', headers: {} };

    const cacheKey = this.determineCacheKey(url, init);
    let httpCacheItem = this.cacheGet(cacheKey);
    if (httpCacheItem) {
      this.logger.info(`Cached fetch ${request.method} ${url}`, ctx);
      return this.handleHttpCacheItem(ctx, httpCacheItem, url, init);
    }

    const response = await this.queuedFetch(ctx, url, newInit);
    const body = await response.text();

    const policy = new CachePolicy(request, { status: response.status, headers: this.headersToObject(response.headers) }, { shared: false });

    httpCacheItem = { policy, status: response.status, statusText: response.statusText, body };

    this.cacheSet(cacheKey, httpCacheItem);

    return this.handleHttpCacheItem(ctx, httpCacheItem, url, init);
  };

  protected async fetchWithTimeout(ctx: Context, url: URL, init?: CustomRequestInit): Promise<Response> {
    this.logger.info(`Fetch ${init?.method ?? 'GET'} ${url}`, ctx);

    if (this.rateLimitedCache.has(url.host)) {
      throw new TooManyRequestsError(this.rateLimitedCache.getRemainingTTL(url.host) / 1000);
    }

    if ((this.timeoutsCountCache.get(url.host) ?? 0) >= (init?.timeoutsCountThrow ?? this.DEFAULT_FAILED_REQUEST_COUNT_THROW)) {
      throw new TooManyTimeoutsError();
    }

    let response;
    try {
      response = await fetch(url, { ...init, keepalive: true, signal: AbortSignal.timeout(init?.timeout ?? this.DEFAULT_TIMEOUT) });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        await this.increaseTimeoutsCount(url);
        throw new TimeoutError();
      }

      throw error;
    }

    await this.decreaseTimeoutsCount(url);

    return response;
  };

  private async increaseTimeoutsCount(url: URL) {
    await this.timeoutsCountMutex.runExclusive(async () => {
      const count = (this.timeoutsCountCache.get(url.host) ?? 0) + 1;
      this.timeoutsCountCache.set(url.host, count, { ttl: this.TIMEOUT_CACHE_TTL });
    });
  }

  private async decreaseTimeoutsCount(url: URL) {
    await this.timeoutsCountMutex.runExclusive(async () => {
      const count = Math.max(0, (this.timeoutsCountCache.get(url.host) ?? 0) - 1);
      this.timeoutsCountCache.set(url.host, count, { ttl: this.TIMEOUT_CACHE_TTL });
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
}
