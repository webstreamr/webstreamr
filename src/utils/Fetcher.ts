import { FetchInterface, FetchOptions } from 'make-fetch-happen';
import UserAgent from 'user-agents';
import { LRUCache } from 'lru-cache';
import { logInfo } from './log';
import { Context } from '../types';

export class Fetcher {
  private readonly fetch: FetchInterface;

  private readonly cache: LRUCache<string, string>;

  constructor(fetch: FetchInterface) {
    this.fetch = fetch;
    this.cache = new LRUCache({ max: 128 });
  }

  readonly text = async (ctx: Context, uriOrRequest: string | Request, opts?: FetchOptions): Promise<string> => {
    logInfo(`Fetch ${uriOrRequest}`);

    const response = await this.fetch(
      uriOrRequest,
      {
        ...opts,
        headers: {
          ...opts?.headers,
          'User-Agent': this.createUserAgentForIp(ctx.ip),
          'X-Forwarded-For': ctx.ip,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
    }

    return await response.text();
  };

  private readonly createUserAgentForIp = (ip: string): string => {
    let userAgent = this.cache.get(ip);
    if (userAgent) {
      return userAgent;
    }

    userAgent = (new UserAgent()).toString();

    this.cache.set(ip, userAgent);

    return userAgent;
  };
}
