import fs from 'node:fs';
import slugify from 'slugify';
import winston from 'winston';
import { Context } from '../../types';
import { envGet } from '../env';
const { Fetcher } = jest.requireActual('../Fetcher');

class MockedFetcher {
  private readonly fetcher: typeof Fetcher;

  constructor() {
    this.fetcher = new Fetcher(winston.createLogger({ transports: [new winston.transports.Console()] }));
  }

  readonly text = async (ctx: Context, url: URL, init?: RequestInit): Promise<string> => {
    const path = `${__dirname}/../__fixtures__/Fetcher/${slugify(url.href)}`;

    return this.fetch(path, ctx, url, init);
  };

  readonly textPost = async (ctx: Context, url: URL, data: unknown, init?: RequestInit): Promise<string> => {
    const path = `${__dirname}/../__fixtures__/Fetcher/post-${slugify(url.href)}-${slugify(JSON.stringify(data))}`;

    return this.fetch(path, ctx, url, { ...init, method: 'POST', body: JSON.stringify(data) });
  };

  readonly head = async (ctx: Context, url: URL, init?: RequestInit): Promise<unknown> => {
    const path = `${__dirname}/../__fixtures__/Fetcher/head-${slugify(url.href)}`;

    return JSON.parse(await this.fetch(path, ctx, url, { ...init, method: 'HEAD' }));
  };

  private readonly fetch = async (path: string, ctx: Context, url: URL, init?: RequestInit): Promise<string> => {
    const errorPath = `${path}.error`;

    if (fs.existsSync(errorPath)) {
      throw new Error(fs.readFileSync(errorPath).toString());
    } else if (fs.existsSync(path)) {
      return fs.readFileSync(path).toString();
    } else {
      let response;
      try {
        if (envGet('TEST_UPDATE_FIXTURES')) {
          response = await fetch(url, this.fetcher.getInit(ctx, url, init));
        } else {
          console.error(`No fixture found at "${path}".`);
          process.exit(1);
        }
      } catch (error) {
        fs.writeFileSync(errorPath, `${error}`);
        throw error;
      }

      if (!response.ok) {
        const message = `Fetcher error: ${response.status}: ${response.statusText}`;
        fs.writeFileSync(errorPath, message);
        throw new Error(message);
      }

      let result;
      if (init?.method === 'HEAD') {
        result = JSON.stringify(response.headers);
      } else {
        result = await response.text();
      }

      fs.writeFileSync(path, result);

      return result;
    }
  };
}

export { MockedFetcher as Fetcher };
