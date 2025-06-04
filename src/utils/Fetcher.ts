import CachePolicy from 'http-cache-semantics';
import TTLCache from '@isaacs/ttlcache';
import winston from 'winston';
import { Cookie, CookieJar } from 'tough-cookie';
import { Context, TIMEOUT } from '../types';
import { BlockedError, NotFoundError, QueueIsFullError } from '../error';
import { clearTimeout } from 'node:timers';
import { envGet } from './env';

interface HttpCacheItem {
  policy: CachePolicy;
  status: number;
  statusText: string;
  body: string;
}

interface HostQueue {
  promise: Promise<void>;
  count: number;
}

interface FlareResolverCookie {
  domain: string;
  expiry: number;
  httpOnly: boolean;
  name: string;
  path: string;
  sameSite: string;
  secure: boolean;
  value: string;
}

export class Fetcher {
  private readonly logger: winston.Logger;
  private readonly queueLimit: number;
  private readonly timeout: number;

  private readonly httpCache: TTLCache<string, HttpCacheItem>;
  private readonly hostQueues = new Map<string, HostQueue>();
  private readonly hostUserAgentMap = new Map<string, string>();
  private readonly cookieJar = new CookieJar();

  constructor(logger: winston.Logger, queueLimit?: number, timeout?: number) {
    this.logger = logger;
    this.queueLimit = queueLimit ?? 10;
    this.timeout = timeout ?? 10000;

    this.httpCache = new TTLCache();
  }

  readonly text = async (ctx: Context, url: URL, init?: RequestInit): Promise<string> => {
    return (await this.cachedFetch(ctx, url, init)).body;
  };

  readonly textPost = async (ctx: Context, url: URL, data: unknown, init?: RequestInit): Promise<string> => {
    return (await this.cachedFetch(ctx, url, { ...init, method: 'POST', body: JSON.stringify(data) })).body;
  };

  readonly head = async (ctx: Context, url: URL, init?: RequestInit): Promise<CachePolicy.Headers> => {
    return (await this.cachedFetch(ctx, url, { ...init, method: 'HEAD' })).policy.responseHeaders();
  };

  public readonly getInit = (ctx: Context, url: URL, init?: RequestInit): RequestInit => {
    const cookieString = this.cookieJar.getCookieStringSync(url.href);

    return {
      ...init,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en',
        ...(cookieString && { Cookie: cookieString }),
        'Forwarded': `for=${ctx.ip}`,
        'Priority': 'u=0',
        'Referer': `${ctx.referer?.href ?? url.origin}`,
        'User-Agent': this.hostUserAgentMap.get(url.host) ?? 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
        'X-Forwarded-For': ctx.ip,
        'X-Forwarded-Proto': url.protocol.slice(0, -1),
        'X-Real-IP': ctx.ip,
        ...init?.headers,
      },
    };
  };

  private readonly handleHttpCacheItem = async (ctx: Context, httpCacheItem: HttpCacheItem, url: URL): Promise<HttpCacheItem> => {
    if (httpCacheItem.status && httpCacheItem.status >= 200 && httpCacheItem.status <= 299) {
      return httpCacheItem;
    }

    if (httpCacheItem.status === 404) {
      throw new NotFoundError();
    }

    const responseHeaders = httpCacheItem.policy.responseHeaders();

    if (
      httpCacheItem.policy.responseHeaders()['cf-mitigated'] === 'challenge'
      || (httpCacheItem.status === 403 && httpCacheItem.policy.responseHeaders()['server'] === 'cloudflare')
    ) {
      const flareSolverrEndpoint = envGet('FLARESOLVERR_ENDPOINT');
      if (!flareSolverrEndpoint) {
        throw new BlockedError('cloudflare_challenge', httpCacheItem.policy.responseHeaders());
      }

      this.logger.info(`Query FlareSolverr for ${url.href}`, ctx);

      const body = { cmd: 'request.get', url: url.href, session: 'default' };
      const challengeResult = await (await this.queuedFetch(ctx, new URL(flareSolverrEndpoint), { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } })).json();
      if (challengeResult.status !== 'ok') {
        this.logger.warn(`FlareSolverr issue: ${JSON.stringify(challengeResult)}`, ctx);
        throw new BlockedError('flaresolverr_failed', {});
      }

      challengeResult.solution.cookies.forEach((cookie: FlareResolverCookie) => {
        if (!['cf_clearance'].includes(cookie.name)) {
          return;
        }

        this.cookieJar.setCookie(
          new Cookie({
            key: cookie.name,
            value: cookie.value,
            expires: new Date(cookie.expiry * 1000),
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
      throw new BlockedError('unknown', httpCacheItem.policy.responseHeaders());
    }

    throw new Error(`Fetcher error: ${httpCacheItem.status}: ${httpCacheItem.statusText}, response headers: ${JSON.stringify(responseHeaders)}`);
  };

  private readonly determineTtl = (httpCacheItem: HttpCacheItem): number => {
    if (httpCacheItem.status === 200) {
      return Math.max(httpCacheItem.policy.timeToLive(), 900000); // 15m at least
    }

    return httpCacheItem.policy.timeToLive();
  };

  private readonly headersToObject = (headers: Headers): Record<string, string> => {
    const obj: Record<string, string> = {};

    headers.forEach((value, name) => {
      obj[name] = value;
    });

    return obj;
  };

  private readonly cachedFetch = async (ctx: Context, url: URL, init?: RequestInit): Promise<HttpCacheItem> => {
    const newInit = this.getInit(ctx, url, init);

    const request: CachePolicy.Request = { url: url.href, method: newInit.method ?? 'GET', headers: {} };

    let httpCacheItem: HttpCacheItem | undefined = this.httpCache.get(url.href);
    if (httpCacheItem) {
      this.logger.info(`Cached fetch ${request.method} ${url}`, ctx);
      return this.handleHttpCacheItem(ctx, httpCacheItem, url);
    }

    const response = await this.queuedFetch(ctx, url, newInit);
    const body = await response.text();

    const policy = new CachePolicy(request, { status: response.status, headers: this.headersToObject(response.headers) }, { shared: false });

    httpCacheItem = { policy, status: response.status, statusText: response.statusText, body };

    const ttl = this.determineTtl(httpCacheItem);
    if (ttl > 0) {
      this.httpCache.set(url.href, httpCacheItem, { ttl });
    }

    return this.handleHttpCacheItem(ctx, httpCacheItem, url);
  };

  private readonly fetchWithTimeout = async (ctx: Context, url: URL, init?: RequestInit): Promise<Response> => {
    this.logger.info(`Fetch ${init?.method ?? 'GET'} ${url}`, ctx);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(TIMEOUT), this.timeout);

    let response;
    try {
      response = await fetch(url, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }

    return response;
  };

  private readonly queuedFetch = async (ctx: Context, url: URL, init?: RequestInit): Promise<Response> => {
    let queue = this.hostQueues.get(url.host);
    if (!queue) {
      queue = { promise: Promise.resolve(), count: 0 };
      this.hostQueues.set(url.host, queue);
    }

    queue.count++;

    if (queue.count > this.queueLimit) {
      throw new QueueIsFullError();
    }

    let resolveCurrent: () => void;
    const currentPromise = new Promise<void>(
      (resolve) => { resolveCurrent = resolve; },
    );

    const fetchPromise = queue.promise.then(async () => {
      try {
        return await this.fetchWithTimeout(ctx, url, init);
      } finally {
        resolveCurrent();
        queue.count--;
      }
    });

    queue.promise = currentPromise.catch(/* istanbul ignore next */ () => undefined);

    return fetchPromise;
  };
}
