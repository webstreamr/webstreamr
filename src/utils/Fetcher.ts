import { FetchInterface, FetchOptions } from 'make-fetch-happen';
import { logInfo } from './log';
import { Context } from '../types';

export class Fetcher {
  private readonly fetch: FetchInterface;

  constructor(fetch: FetchInterface) {
    this.fetch = fetch;
  }

  readonly text = async (ctx: Context, uriOrRequest: string | Request, opts?: FetchOptions): Promise<string> => {
    logInfo(`Fetch ${uriOrRequest}`);

    const response = await this.fetch(
      uriOrRequest,
      {
        ...opts,
        headers: {
          ...opts?.headers,
          'X-Forwarded-For': ctx.ip,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
    }

    return await response.text();
  };
}
