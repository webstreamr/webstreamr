import CachePolicy from 'http-cache-semantics';
import TTLCache from '@isaacs/ttlcache';
import winston from 'winston';
import { Mutex } from 'async-mutex';
import { Cookie, CookieJar } from 'tough-cookie';
import { BlockedReason, Context, TIMEOUT } from '../types';
import { BlockedError, HttpError, NotFoundError, QueueIsFullError } from '../error';
import { clearTimeout } from 'node:timers';
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
  noFlareSolverr?: boolean;
  noReferer?: boolean;
  queueLimit?: number;
  queueErrorLimit?: number;
  timeout?: number;
};

export class Fetcher {
  private readonly logger: winston.Logger;

  private readonly httpCache: TTLCache<string, HttpCacheItem>;
  private readonly hostUserAgentMap = new Map<string, string>();
  private readonly cookieJar = new CookieJar();

  private readonly hostQueueCount = new Map<string, number>();
  private readonly countMutex = new Mutex();

  public constructor(logger: winston.Logger) {
    this.logger = logger;

    this.httpCache = new TTLCache();
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

    const noReferer = init?.noReferer ?? false;

    return {
      ...init,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en',
        ...(cookieString && { Cookie: cookieString }),
        'Forwarded': `for=${ctx.ip}`,
        'Priority': 'u=0',
        ...(!noReferer && { Referer: `${ctx.referer?.href ?? url.origin}` }),
        'User-Agent': this.hostUserAgentMap.get(url.host) ?? 'node',
        'X-Forwarded-For': ctx.ip,
        'X-Forwarded-Proto': url.protocol.slice(0, -1),
        'X-Real-IP': ctx.ip,
        ...init?.headers,
      },
    };
  };

  private async handleHttpCacheItem(ctx: Context, httpCacheItem: HttpCacheItem, url: URL, init?: CustomRequestInit): Promise<HttpCacheItem> {
    if (httpCacheItem.status && httpCacheItem.status >= 200 && httpCacheItem.status <= 299) {
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
      const challengeResult = await (await this.queuedFetch(ctx, new URL(flareSolverrEndpoint), { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, queueLimit: 1, timeout: 10000 })).json() as FlareSolverrResult;
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

      const ttl = this.determineTtl(httpCacheItem);
      /* istanbul ignore next */
      if (ttl > 0) {
        this.httpCache.set(url.href, httpCacheItem, { ttl });
      }

      return httpCacheItem;
    }

    if (httpCacheItem.status === 403) {
      throw new BlockedError(BlockedReason.unknown, httpCacheItem.policy.responseHeaders());
    }

    throw new HttpError(httpCacheItem.status, httpCacheItem.statusText, responseHeaders);
  };

  private determineTtl(httpCacheItem: HttpCacheItem): number {
    if (httpCacheItem.status === 200) {
      return Math.max(httpCacheItem.policy.timeToLive(), 900000); // 15m at least
    }

    return httpCacheItem.policy.timeToLive();
  };

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

    let httpCacheItem: HttpCacheItem | undefined = this.httpCache.get(url.href);
    if (httpCacheItem) {
      this.logger.info(`Cached fetch ${request.method} ${url}`, ctx);
      return this.handleHttpCacheItem(ctx, httpCacheItem, url, init);
    }

    const response = await this.queuedFetch(ctx, url, newInit);
    const body = await response.text();

    const policy = new CachePolicy(request, { status: response.status, headers: this.headersToObject(response.headers) }, { shared: false });

    httpCacheItem = { policy, status: response.status, statusText: response.statusText, body };

    const ttl = this.determineTtl(httpCacheItem);
    if (ttl > 0) {
      this.httpCache.set(url.href, httpCacheItem, { ttl });
    }

    return this.handleHttpCacheItem(ctx, httpCacheItem, url, init);
  };

  protected async fetchWithTimeout(ctx: Context, url: URL, init?: CustomRequestInit): Promise<Response> {
    this.logger.info(`Fetch ${init?.method ?? 'GET'} ${url}`, ctx);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(TIMEOUT), init?.timeout ?? 5000);

    let response;
    try {
      response = await fetch(url, { ...init, keepalive: true, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }

    return response;
  };

  private getHostQueueCount(host: string): number {
    return this.hostQueueCount.get(host) ?? 0;
  }

  private async lockFetchSlot(host: string, queueErrorLimit: number) {
    await this.countMutex.runExclusive(() => {
      if (this.getHostQueueCount(host) > queueErrorLimit) {
        throw new QueueIsFullError();
      }

      this.hostQueueCount.set(host, this.getHostQueueCount(host) + 1);
    });
  };

  private async unlockFetchSlot(host: string) {
    await this.countMutex.runExclusive(() => {
      this.hostQueueCount.set(host, Math.max(0, this.getHostQueueCount(host) - 1));
    });
  };

  private async waitForHostQueueCount(host: string, queueLimit: number, queueErrorLimit: number): Promise<void> {
    while (this.getHostQueueCount(host) > queueLimit) {
      if (this.getHostQueueCount(host) > queueErrorLimit) {
        // Very unlikely to happen..
        throw new QueueIsFullError();
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  private async queuedFetch(ctx: Context, url: URL, init?: CustomRequestInit): Promise<Response> {
    const queueLimit = init?.queueLimit ?? 5;
    const queueErrorLimit = init?.queueErrorLimit ?? 10;

    await this.lockFetchSlot(url.host, queueErrorLimit);

    try {
      await this.waitForHostQueueCount(url.host, queueLimit, queueErrorLimit);

      return await this.fetchWithTimeout(ctx, url, init);
    } finally {
      await this.unlockFetchSlot(url.host);
    }
  };
}
