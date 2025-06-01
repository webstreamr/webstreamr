import CachePolicy from 'http-cache-semantics';
import TTLCache from '@isaacs/ttlcache';
import winston from 'winston';
import { Context } from '../types';
import { BlockedError, NotFoundError } from '../error';
import { clearTimeout } from 'node:timers';

interface HttpCacheItem { policy: CachePolicy; status: number; statusText: string; body: string }

export class Fetcher {
  private readonly logger: winston.Logger;
  private readonly httpCache: TTLCache<string, HttpCacheItem>;

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

  private readonly getInit = (ctx: Context, url: URL, init?: RequestInit): RequestInit => ({
    ...init,
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en',
      'Forwarded': `for=${ctx.ip}`,
      'Priority': 'u=0',
      'Referer': `${ctx.referer?.href ?? url.origin}`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.3',
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

    this.logger.info(`Fetch ${request.method} ${url}`, ctx);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    let response;
    try {
      response = await fetch(url, { ...newInit, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }

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
}
