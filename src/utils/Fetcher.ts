/* istanbul ignore file */
import { Mutex, Semaphore, SemaphoreInterface, withTimeout } from 'async-mutex';
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Cacheable, CacheableMemory, Keyv } from 'cacheable';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { minimatch } from 'minimatch';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { Cookie, CookieJar } from 'tough-cookie';
import winston from 'winston';
import { BlockedError, HttpError, NotFoundError, QueueIsFullError, TimeoutError, TooManyRequestsError, TooManyTimeoutsError } from '../error';
import { BlockedReason, Context } from '../types';
import { envGet } from './env';

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

export type CustomRequestConfig = AxiosRequestConfig & {
  minCacheTtl?: number;
  queueLimit?: number;
  queueTimeout?: number;
  timeout?: number;
  timeoutsCountThrow?: number;
};

export class Fetcher {
  private readonly DEFAULT_TIMEOUT = 10000;
  private readonly DEFAULT_QUEUE_LIMIT = 10;
  private readonly DEFAULT_QUEUE_TIMEOUT = 10000;
  private readonly DEFAULT_TIMEOUTS_COUNT_THROW = 30;
  private readonly TIMEOUT_CACHE_TTL = 3600000; // 1h
  private readonly MAX_WAIT_RETRY_AFTER = 10000;

  private readonly axios: AxiosInstance;
  private readonly logger: winston.Logger;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly proxyAgents = new Map<string, Record<'httpAgent' | 'httpsAgent', any>>();
  private readonly rateLimitedCache = new Cacheable({ primary: new Keyv({ store: new CacheableMemory({ lruSize: 1024 }) }) });
  private readonly semaphores = new Map<string, SemaphoreInterface>();
  private readonly hostUserAgentMap = new Map<string, string>();
  private readonly cookieJar = new CookieJar();

  private readonly timeoutsCountCache = new Cacheable({ primary: new Keyv({ store: new CacheableMemory({ lruSize: 1024 }) }) });
  private readonly timeoutsCountMutex = new Mutex();

  public constructor(axios: AxiosInstance, logger: winston.Logger) {
    this.axios = axios;
    this.logger = logger;
  }

  public stats() {
    return {};
  };

  public async fetch(ctx: Context, url: URL, requestConfig?: CustomRequestConfig): Promise<AxiosResponse> {
    return await this.queuedFetch(ctx, url, requestConfig);
  };

  public async text(ctx: Context, url: URL, requestConfig?: CustomRequestConfig): Promise<string> {
    return (await this.queuedFetch(ctx, url, requestConfig)).data;
  };

  public async textPost(ctx: Context, url: URL, data: string, requestConfig?: CustomRequestConfig): Promise<string> {
    return (await this.queuedFetch(ctx, url, { ...requestConfig, method: 'POST', data })).data;
  };

  public async head(ctx: Context, url: URL, requestConfig?: CustomRequestConfig): Promise<AxiosResponse['headers']> {
    return (await this.queuedFetch(ctx, url, { ...requestConfig, method: 'HEAD' })).headers;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async json(ctx: Context, url: URL, requestConfig?: CustomRequestConfig): Promise<any> {
    const jsonRequestConfig = {
      headers: {
        Accept: 'application/json,text/plain,*/*',
      },
      ...requestConfig,
    };

    return JSON.parse(await this.text(ctx, url, jsonRequestConfig));
  }

  protected async fetchWithTimeout(ctx: Context, url: URL, requestConfig?: CustomRequestConfig, tryCount = 0): Promise<AxiosResponse> {
    const proxyUrl = this.getProxyForUrl(url);

    let message = `Fetch ${requestConfig?.method ?? 'GET'} ${url}`;
    /* istanbul ignore if */
    if (requestConfig?.headers && requestConfig?.headers['Referer']) {
      message += ' with referer ' + requestConfig?.headers['Referer'];
    }
    /* istanbul ignore if */
    if (proxyUrl) {
      message += ' via proxy ' + proxyUrl;
    }
    this.logger.info(message, ctx);

    const isRateLimitedRaw = await this.rateLimitedCache.getRaw<true>(url.host);
    /* istanbul ignore if */
    if (isRateLimitedRaw && isRateLimitedRaw.value && isRateLimitedRaw.expires) {
      const ttl = isRateLimitedRaw.expires - Date.now();
      if (ttl <= this.MAX_WAIT_RETRY_AFTER && tryCount < 1) {
        this.logger.info(`Wait out rate limit for ${url}`, ctx);

        await this.sleep(ttl);

        return await this.fetchWithTimeout(ctx, url, { ...requestConfig, queueLimit: 1 }, ++tryCount);
      }

      throw new TooManyRequestsError(url, (isRateLimitedRaw.expires as number - Date.now()) / 1000);
    }

    const timeouts = (await this.timeoutsCountCache.get<number>(url.host)) ?? 0;
    if (timeouts >= (requestConfig?.timeoutsCountThrow ?? this.DEFAULT_TIMEOUTS_COUNT_THROW)) {
      throw new TooManyTimeoutsError(url);
    }

    let response;
    try {
      const finalUrl = new URL(url.href);
      finalUrl.username = '';
      finalUrl.password = '';

      const cookieString = this.cookieJar.getCookieStringSync(url.href);

      const forwardedProto = url.protocol.slice(0, -1);

      const hostUserAgent = this.hostUserAgentMap.get(url.host);

      response = await this.axios.request({
        ...requestConfig,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en',
          ...(url.username && { Authorization: 'Basic ' + Buffer.from(`${url.username}:${url.password}`).toString('base64') }),
          'Priority': 'u=0',
          'User-Agent': this.hostUserAgentMap.get(url.host) ?? 'Mozilla',
          ...(hostUserAgent && { 'User-Agent': hostUserAgent }),
          ...(cookieString && { Cookie: cookieString }),
          ...(ctx.ip && {
            'Forwarded': `by=unknown;for=${ctx.ip};host=${url.host};proto=${forwardedProto}`,
            'X-Forwarded-For': ctx.ip,
            'X-Forwarded-Host': url.host,
            'X-Forwarded-Proto': forwardedProto,
            'X-Real-IP': ctx.ip,
          }),
          ...(proxyUrl && this.getProxyAgents(proxyUrl)),
          ...requestConfig?.headers,
        },
        url: finalUrl.href,
        timeout: this.DEFAULT_TIMEOUT,
        transformResponse: [data => data],
        validateStatus: () => true,
      });
    } catch (error) {
      this.logger.info(`Got error ${error} for ${url}`, ctx);

      if (error instanceof AxiosError && error.code === 'ECONNABORTED') {
        await this.increaseTimeoutsCount(url);
        throw new TimeoutError(url);
      }

      throw error;
    }

    this.logger.info(`Got ${response.status} (${response.statusText}) for ${url}`, ctx);

    await this.decreaseTimeoutsCount(url);

    if (response.status === 429) {
      const retryAfter = parseInt(`${response.headers['retry-after']}`) * 1000;
      if (retryAfter <= this.MAX_WAIT_RETRY_AFTER && tryCount < 1) {
        this.logger.info(`Wait out rate limit for ${url.host}`, ctx);

        await this.sleep(retryAfter);

        return await this.fetchWithTimeout(ctx, url, { ...requestConfig, queueLimit: 1 }, ++tryCount);
      }
    }

    const triggeredCloudflareTurnstile = 'cf-turnstile' in response.headers;

    if (response.status && response.status >= 200 && response.status <= 399 && !triggeredCloudflareTurnstile) {
      return response;
    }

    if (response.status === 404) {
      throw new NotFoundError();
    }

    if (response.headers['cf-mitigated'] === 'challenge' || triggeredCloudflareTurnstile) {
      const flareSolverrEndpoint = envGet('FLARESOLVERR_ENDPOINT');
      if (!flareSolverrEndpoint) {
        throw new BlockedError(url, BlockedReason.cloudflare_challenge, response.headers);
      }

      this.logger.info(`Query FlareSolverr for ${url.href}`, ctx);

      const body = { cmd: 'request.get', url: url.href, session: 'default' };
      // @ts-expect-error idjaow awdiajwdoajwdoiajwdoi
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

      response.data = challengeResult.solution.response;

      return response;
    }

    if (response.status === 403) {
      if (ctx.config.mediaFlowProxyUrl && url.href.startsWith(ctx.config.mediaFlowProxyUrl)) {
        throw new BlockedError(url, BlockedReason.media_flow_proxy_auth, response.headers);
      }

      throw new BlockedError(url, BlockedReason.unknown, response.headers);
    }

    if (response.status === 451) {
      throw new BlockedError(url, BlockedReason.cloudflare_censor, response.headers);
    }

    if (response.status === 429) {
      const retryAfter = parseInt(`${response.headers['retry-after']}`);
      if (!isNaN(retryAfter)) {
        await this.rateLimitedCache.set<true>(url.host, true, retryAfter * 1000);
      }

      throw new TooManyRequestsError(url, retryAfter);
    }

    throw new HttpError(url, response.status, response.statusText, response.headers);
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
      sem = withTimeout(new Semaphore(queueLimit), queueTimeout, new QueueIsFullError(url));
      this.semaphores.set(url.host, sem);
    }

    return sem;
  }

  private async queuedFetch(ctx: Context, url: URL, init?: CustomRequestConfig): Promise<AxiosResponse> {
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

  private getProxyForUrl(url: URL): URL | undefined {
    const proxyConfig = process.env['PROXY_CONFIG'];

    if (proxyConfig) {
      for (const rule of proxyConfig.split(',')) {
        const [hostPattern, proxy] = rule.split(/:(.+)/);
        if (!hostPattern || !proxy) {
          throw new Error(`Proxy rule "${rule}" is invalid.`);
        }

        if (hostPattern === '*' || minimatch(url.host, hostPattern)) {
          return proxy === 'false' ? undefined : new URL(proxy);
        }
      }
    } else if (process.env['ALL_PROXY']) {
      return new URL(process.env['ALL_PROXY']);
    }

    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getProxyAgents(proxyUrl: URL): Record<'httpAgent' | 'httpsAgent', any> {
    let proxyAgents = this.proxyAgents.get(proxyUrl.href);

    if (!proxyAgents) {
      proxyAgents = {
        httpAgent: proxyUrl.protocol === 'socks5:' ? new SocksProxyAgent(proxyUrl) : new HttpProxyAgent(proxyUrl),
        httpsAgent: proxyUrl.protocol === 'socks5:' ? new SocksProxyAgent(proxyUrl) : new HttpsProxyAgent(proxyUrl),
      };

      this.proxyAgents.set(proxyUrl.href, proxyAgents);
    }

    return proxyAgents;
  }
}
