import { AxiosInstance, AxiosRequestConfig } from 'axios';
import TTLCache from '@isaacs/ttlcache';
import UserAgent from 'user-agents';
import winston from 'winston';
import { Context } from '../types';

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

    const response = await this.axios.get(url.href, this.getConfig(ctx, url, config));

    return response.data;
  };

  readonly textPost = async (ctx: Context, url: URL, data: unknown, config?: AxiosRequestConfig): Promise<string> => {
    this.logger.info(`Fetch post ${url}`, ctx);

    const response = await this.axios.post(url.href, data, this.getConfig(ctx, url, config));

    return response.data;
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
}
