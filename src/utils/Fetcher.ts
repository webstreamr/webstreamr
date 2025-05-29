import { AxiosInstance, AxiosRequestConfig, AxiosResponseHeaders, RawAxiosResponseHeaders, isAxiosError } from 'axios';
import TTLCache from '@isaacs/ttlcache';
import UserAgent from 'user-agents';
import winston from 'winston';
import { Context } from '../types';
import { CloudflareChallengeError, NotFoundError } from '../error';

export class Fetcher {
  private readonly axios: AxiosInstance;
  private readonly logger: winston.Logger;
  private readonly ipUserAgentCache: TTLCache<string, string>;

  constructor(axios: AxiosInstance, logger: winston.Logger) {
    this.axios = axios;
    this.logger = logger;
    this.ipUserAgentCache = new TTLCache({ max: 1024, ttl: 86400000 }); // 24h
  }

  readonly text = async (ctx: Context, url: URL, config?: AxiosRequestConfig): Promise<string> => {
    this.logger.info(`Fetch ${url}`, ctx);

    return (await this.errorWrapper(() => this.axios.get(url.href, this.getConfig(ctx, url, config)))).data;
  };

  readonly textPost = async (ctx: Context, url: URL, data: unknown, config?: AxiosRequestConfig): Promise<string> => {
    this.logger.info(`Fetch post ${url}`, ctx);

    return (await this.errorWrapper(() => this.axios.post(url.href, data, this.getConfig(ctx, url, config)))).data;
  };

  readonly head = async (ctx: Context, url: URL, config?: AxiosRequestConfig): Promise<RawAxiosResponseHeaders | AxiosResponseHeaders> => {
    this.logger.info(`Fetch head ${url}`, ctx);

    return (await this.errorWrapper(() => this.axios.head(url.href, this.getConfig(ctx, url, config)))).headers;
  };

  private readonly getConfig = (ctx: Context, url: URL, config?: AxiosRequestConfig): AxiosRequestConfig => {
    const origin = ctx.referer?.origin ?? url.origin;
    const referer = ctx.referer?.href ?? url.origin;

    return {
      responseType: 'text',
      timeout: 5000,
      ...config,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en',
        'Forwarded': `for=${ctx.ip}`,
        'Origin': `${origin}`,
        'Priority': 'u=0',
        'Referer': `${referer}`,
        'User-Agent': this.createUserAgentForIp(ctx.ip),
        'X-Forwarded-For': ctx.ip,
        'X-Forwarded-Proto': url.protocol.slice(0, -1),
        'X-Real-IP': ctx.ip,
        ...config?.headers,
      },
    };
  };

  private readonly createUserAgentForIp = (ip: string): string => {
    let userAgent = this.ipUserAgentCache.get(ip);
    if (userAgent) {
      return userAgent;
    }

    userAgent = (new UserAgent()).toString();

    this.ipUserAgentCache.set(ip, userAgent);

    return userAgent;
  };

  private readonly errorWrapper = async <T>(callable: () => T): Promise<T> => {
    try {
      return await callable();
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new NotFoundError();
        }

        if (error.response?.headers['cf-mitigated'] === 'challenge') {
          throw new CloudflareChallengeError();
        }
      }

      throw error;
    }
  };
}
