import CachePolicy from 'http-cache-semantics';
import TTLCache from '@isaacs/ttlcache';
import winston from 'winston';
import { Context, TIMEOUT } from '../types';
import { BlockedError, NotFoundError, QueueIsFullError } from '../error';
import { clearTimeout } from 'node:timers';

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

export class Fetcher {
  private readonly logger: winston.Logger;
  private readonly httpCache: TTLCache<string, HttpCacheItem>;
  private readonly hostQueues = new Map<string, HostQueue>();

  constructor(logger: winston.Logger) {
    this.logger = logger;
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

  public readonly getInit = (ctx: Context, url: URL, init?: RequestInit): RequestInit => ({
    ...init,
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en',
      'Forwarded': `for=${ctx.ip}`,
      'Priority': 'u=0',
      'Referer': `${ctx.referer?.href ?? url.origin}`,
      'User-Agent': 'node',
      'X-Forwarded-For': ctx.ip,
      'X-Forwarded-Proto': url.protocol.slice(0, -1),
      'X-Real-IP': ctx.ip,
      ...init?.headers,
    },
  });

  private readonly handleHttpCacheItem = (httpCacheItem: HttpCacheItem): HttpCacheItem => {
    if (httpCacheItem.status && httpCacheItem.status >= 200 && httpCacheItem.status <= 299) {
      return httpCacheItem;
    }

    if (httpCacheItem.status === 404) {
      throw new NotFoundError();
    }

    const responseHeaders = httpCacheItem.policy.responseHeaders();

    if (httpCacheItem.policy.responseHeaders()['cf-mitigated'] === 'challenge') {
      throw new BlockedError('cloudflare_challenge');
    }

    if (httpCacheItem.status === 403) {
      throw new BlockedError('unknown');
    }

    throw new Error(`Fetcher error: ${httpCacheItem.status}: ${httpCacheItem.statusText}, response headers: ${JSON.stringify(responseHeaders)}`);
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
      return this.handleHttpCacheItem(httpCacheItem);
    }

    const response = await this.queuedFetch(ctx, url, newInit);
    const body = await response.text();

    const policy = new CachePolicy(request, { status: response.status, headers: this.headersToObject(response.headers) }, { shared: false });

    httpCacheItem = { policy, status: response.status, statusText: response.statusText, body };

    let ttl;
    if (response.ok) {
      ttl = Math.max(policy.timeToLive(), 900000); // 15m at least
    } else {
      ttl = policy.timeToLive();
    }

    if (ttl > 0) {
      this.httpCache.set(url.href, httpCacheItem, { ttl });
    }

    return this.handleHttpCacheItem(httpCacheItem);
  };

  private readonly queuedFetch = async (ctx: Context, url: URL, init?: RequestInit): Promise<Response> => {
    let queue = this.hostQueues.get(url.host);
    if (!queue) {
      queue = { promise: Promise.resolve(), count: 0 };
      this.hostQueues.set(url.host, queue);
    }

    queue.count++;

    if (queue.count > 10) {
      throw new QueueIsFullError();
    }

    let resolveCurrent: () => void;
    const currentPromise = new Promise<void>(
      (resolve) => { resolveCurrent = resolve; },
    );

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(TIMEOUT), 10000);

    const fetchPromise = queue.promise.then(async () => {
      try {
        this.logger.info(`Fetch ${init?.method ?? 'GET'} ${url}`, ctx);

        return await fetch(url, { ...init, signal: controller.signal });
      } finally {
        clearTimeout(timer);
        resolveCurrent();
        queue.count--;
      }
    });

    queue.promise = currentPromise.catch(/* istanbul ignore next */ () => undefined);

    return fetchPromise;
  };
}
