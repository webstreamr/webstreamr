/* istanbul ignore file */
import { Agent as HttpsAgent } from 'node:https';
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
import { envGet, envGetAppId } from './env';

interface FlareSolverrResult {
  status: string;
  message: string;
  solution: {
    url: string;
    status: number;
    cookies: {
      domain: string;
      expiry: number;
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

type ProxyConfig = Pick<AxiosRequestConfig, 'httpAgent' | 'httpsAgent' | 'proxy'>;

export type CustomRequestConfig = AxiosRequestConfig & {
  minCacheTtl?: number;
  noProxyHeaders?: boolean;
  queueLimit?: number;
  queueTimeout?: number;
  timeout?: number;
  timeoutsCountThrow?: number;
};

export class Fetcher {
  private readonly DEFAULT_TIMEOUT = 10000;
  private readonly DEFAULT_QUEUE_LIMIT = 50;
  private readonly DEFAULT_QUEUE_TIMEOUT = 10000;
  private readonly DEFAULT_TIMEOUTS_COUNT_THROW = 30;
  private readonly TIMEOUT_CACHE_TTL = 3600000; // 1h
  private readonly MAX_WAIT_RETRY_AFTER = 10000;

  private readonly axios: AxiosInstance;
  private readonly logger: winston.Logger;

  private readonly proxyConfig = new Map<string, ProxyConfig>();
  private readonly rateLimitedCache = new Cacheable({ primary: new Keyv({ store: new CacheableMemory({ lruSize: 1024 }) }) });
  private readonly semaphores = new Map<string, SemaphoreInterface>();
  private readonly hostUserAgentMap = new Map<string, string>();

  private readonly cookieJar = new CookieJar();

  private readonly timeoutsCountCache = new Cacheable({ primary: new Keyv({ store: new CacheableMemory({ lruSize: 1024 }) }) });
  private readonly timeoutsCountMutex = new Mutex();

  private readonly httpStatus = new Map<string, Record<number, number>>();
  private readonly httpStatusMutex = new Mutex();

  private readonly flareSolverrMutexes = new Map<string, Mutex>();

  public constructor(axios: AxiosInstance, logger: winston.Logger) {
    this.axios = axios;
    this.logger = logger;
  }

  public stats() {
    return {
      httpStatus: Object.fromEntries(this.httpStatus),
      hostUserAgentMap: Object.fromEntries(this.hostUserAgentMap),
      cookieJar: this.cookieJar.toJSON(),
    };
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

  public async getFinalRedirectUrl(ctx: Context, url: URL, requestConfig?: CustomRequestConfig, maxCount?: number, count?: number): Promise<URL> {
    const newRequestConfig = { ...requestConfig, method: 'HEAD', maxRedirects: 0 };

    if (count && maxCount && count >= maxCount) {
      return url;
    }

    const response = await this.queuedFetch(ctx, url, newRequestConfig);
    if (response.status >= 300 && response.status < 400) {
      return await this.getFinalRedirectUrl(ctx, new URL(response.headers['location']), newRequestConfig, maxCount, (count ?? 0) + 1);
    }

    return url;
  }

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
    const proxyUrl = this.getProxyForUrl(ctx, url);

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
    if (!this.isFlareSolverrUrl(url) && timeouts >= (requestConfig?.timeoutsCountThrow ?? this.DEFAULT_TIMEOUTS_COUNT_THROW)) {
      throw new TooManyTimeoutsError(url);
    }

    let response;
    try {
      const finalUrl = new URL(url.href);
      finalUrl.username = '';
      finalUrl.password = '';

      const cookieString = this.cookieJar.getCookieStringSync(url.href);

      const forwardedProto = url.protocol.slice(0, -1);

      response = await this.axios.request({
        ...requestConfig,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en',
          ...(url.username && { Authorization: 'Basic ' + Buffer.from(`${url.username}:${url.password}`).toString('base64') }),
          'Priority': 'u=0',
          'User-Agent': this.hostUserAgentMap.get(url.host) ?? 'Mozilla',
          ...(cookieString && { Cookie: cookieString }),
          ...(ctx.ip && !requestConfig?.noProxyHeaders && {
            'Forwarded': `by=unknown;for=${ctx.ip};host=${url.host};proto=${forwardedProto}`,
            'X-Forwarded-For': ctx.ip,
            'X-Forwarded-Host': url.host,
            'X-Forwarded-Proto': forwardedProto,
            'X-Real-IP': ctx.ip,
          }),
          ...requestConfig?.headers,
        },
        ...(proxyUrl && this.getProxyConfig(proxyUrl)),
        ...(!proxyUrl && { httpsAgent: new HttpsAgent({ rejectUnauthorized: false }) }),
        url: finalUrl.href,
        timeout: requestConfig?.timeout ?? this.DEFAULT_TIMEOUT,
        transformResponse: [data => data],
        validateStatus: () => true,
      });
    } catch (error) {
      await this.trackHttpStatus(ctx, url, 0);
      this.logger.info(`Got error ${error} for ${url}`, ctx);

      if (error instanceof AxiosError && error.code === 'ECONNABORTED') {
        await this.increaseTimeoutsCount(url);
        throw new TimeoutError(url);
      }

      throw error;
    }

    await this.trackHttpStatus(ctx, url, response.status);
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

      const session = `${envGetAppId()}_${url.host}`;

      let mutex = this.flareSolverrMutexes.get(session);
      if (!mutex) {
        mutex = new Mutex();
        this.flareSolverrMutexes.set(session, mutex);
      }

      const challengeResult = await mutex.runExclusive(async () => {
        this.logger.info(`Query FlareSolverr for ${url.href}`, ctx);

        const data = {
          cmd: 'request.get',
          url: url.href,
          session,
          session_ttl_minutes: 60,
          maxTimeout: 15000,
          disableMedia: true,
          ...(proxyUrl && { proxy: { url: proxyUrl.href } }),
        };

        const requestConfig: CustomRequestConfig = { method: 'POST', data, headers: { 'Content-Type': 'application/json' }, timeout: 15000, queueTimeout: 60000 };
        return JSON.parse((await this.queuedFetch(ctx, new URL('/v1', flareSolverrEndpoint), requestConfig)).data) as FlareSolverrResult;
      });

      if (challengeResult.status !== 'ok') {
        this.logger.warn(`FlareSolverr issue: ${JSON.stringify(challengeResult)}`, ctx);
        throw new BlockedError(url, BlockedReason.flaresolverr_failed, {});
      }

      challengeResult.solution.cookies.forEach((cookie) => {
        if (!cookie.name.startsWith('cf_') && !cookie.name.startsWith('__cf') && !cookie.name.startsWith('__ddg')) {
          return;
        }

        this.cookieJar.setCookie(
          new Cookie({
            domain: cookie.domain.replace(/^.+/, ''),
            expires: new Date(cookie.expiry * 1000),
            httpOnly: cookie.httpOnly,
            key: cookie.name,
            path: cookie.path,
            sameSite: cookie.sameSite,
            secure: cookie.secure,
            value: cookie.value,
          }),
          url.href,
        );
      });

      this.hostUserAgentMap.set(url.host, challengeResult.solution.userAgent);

      response.data = challengeResult.solution.response;

      return response;
    }

    if (response.status === 403) {
      if (ctx.config.mediaFlowProxyUrl && url.href.includes(ctx.config.mediaFlowProxyUrl)) {
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

  private async queuedFetch(ctx: Context, url: URL, requestConfig?: CustomRequestConfig): Promise<AxiosResponse> {
    const queueLimit = requestConfig?.queueLimit ?? this.DEFAULT_QUEUE_LIMIT;
    const queueTimeout = requestConfig?.queueTimeout ?? this.DEFAULT_QUEUE_TIMEOUT;

    const semaphore = this.getSemaphore(url, queueLimit, queueTimeout);

    const [,release] = await semaphore.acquire();

    try {
      return await this.fetchWithTimeout(ctx, url, requestConfig);
    } finally {
      release();
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(sleep => setTimeout(sleep, ms));
  }

  private isFlareSolverrUrl(url: URL): boolean {
    const flareSolverrEndpoint = envGet('FLARESOLVERR_ENDPOINT');

    return !!flareSolverrEndpoint && url.href.startsWith(flareSolverrEndpoint);
  }

  private getProxyForUrl(ctx: Context, url: URL): URL | undefined {
    if (ctx.config.mediaFlowProxyUrl && url.href.includes(ctx.config.mediaFlowProxyUrl)) {
      return undefined;
    }

    if (this.isFlareSolverrUrl(url)) {
      return undefined;
    }

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

  private getProxyConfig(proxyUrl: URL): ProxyConfig {
    let proxyConfig = this.proxyConfig.get(proxyUrl.href);

    if (!proxyConfig) {
      const httpsAgent = proxyUrl.protocol === 'socks5:' ? new SocksProxyAgent(proxyUrl) : new HttpsProxyAgent(proxyUrl);
      httpsAgent.options.rejectUnauthorized = false;

      proxyConfig = {
        httpAgent: proxyUrl.protocol === 'socks5:' ? new SocksProxyAgent(proxyUrl) : new HttpProxyAgent(proxyUrl),
        httpsAgent,
        proxy: false,
      };

      this.proxyConfig.set(proxyUrl.href, proxyConfig);
    }

    return proxyConfig;
  }

  private async trackHttpStatus(ctx: Context, url: URL, status: number) {
    if (ctx.config.mediaFlowProxyUrl && url.href.includes(ctx.config.mediaFlowProxyUrl)) {
      return;
    }

    await this.httpStatusMutex.runExclusive(() => {
      const httpStatusCounts = this.httpStatus.get(url.host) ?? {};
      httpStatusCounts[status] = (httpStatusCounts[status] ?? 0) + 1;
      this.httpStatus.set(url.host, httpStatusCounts);
    });
  }
}
