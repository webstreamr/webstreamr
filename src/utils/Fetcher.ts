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
    this.logger.info(`Fetch ${url}`);

    const response = await this.axios.get(url.href, this.getConfig(ctx, url, config));

    return response.data;
  };

  readonly textPost = async (ctx: Context, url: URL, data: unknown, config?: AxiosRequestConfig): Promise<string> => {
    this.logger.info(`Fetch post ${url}`);

    const response = await this.axios.post(url.href, data, this.getConfig(ctx, url, config));

    return response.data;
  };

  private readonly getConfig = (ctx: Context, url: URL, config?: AxiosRequestConfig): AxiosRequestConfig => {
    return {
      ...config,
      headers: {
        'User-Agent': this.createUserAgentForIp(ctx.ip),
        'Forwarded': `for=${ctx.ip}`,
        'Referer': `${url.protocol}//${url.host}`,
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
}
