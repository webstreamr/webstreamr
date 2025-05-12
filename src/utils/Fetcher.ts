import { FetchInterface, FetchOptions } from 'make-fetch-happen';
import TTLCache from '@isaacs/ttlcache';
import UserAgent from 'user-agents';
import winston from 'winston';
import { Context } from '../types';

export class Fetcher {
  private readonly fetch: FetchInterface;

  private readonly logger: winston.Logger;

  private readonly ipUserAgentCache: TTLCache<string, string>;

  constructor(fetch: FetchInterface, logger: winston.Logger) {
    this.fetch = fetch;
    this.logger = logger;
    this.ipUserAgentCache = new TTLCache({ max: 1024, ttl: 86400000 }); // 24h
  }

  readonly text = async (ctx: Context, url: URL, opts?: FetchOptions): Promise<string> => {
    this.logger.info(`Fetch ${url}`);

    const response = await this.fetch(
      url.href,
      {
        ...opts,
        headers: {
          ...opts?.headers,
          'User-Agent': this.createUserAgentForIp(ctx.ip),
          'Forwarded': `for=${ctx.ip}`,
          'X-Forwarded-For': ctx.ip,
          'X-Forwarded-Proto': url.protocol.slice(0, -1),
          'X-Real-IP': ctx.ip,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
    }

    return await response.text();
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
