import { AxiosInstance, AxiosRequestConfig, AxiosResponseHeaders, RawAxiosResponseHeaders, isAxiosError } from 'axios';
import TTLCache from '@isaacs/ttlcache';
import UserAgent from 'user-agents';
import winston from 'winston';
import { Context } from '../types';
import { NotFoundError } from '../error';

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
    return {
      responseType: 'text',
      timeout: 15000,
      ...config,
      headers: {
        'User-Agent': this.createUserAgentForIp(ctx.ip),
        'Referer': `${url.origin}`,
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
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundError();
      }
      throw error;
    }
  };
}
