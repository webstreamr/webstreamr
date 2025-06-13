import fs from 'node:fs';
import slugify from 'slugify';
import winston from 'winston';
import crypto from 'crypto';
import { Context } from '../../types';
import { envGet } from '../env';
const { Fetcher } = jest.requireActual('../Fetcher');

class MockedFetcher {
  private readonly fetcher: typeof Fetcher;

  public constructor(logger: winston.Logger) {
    this.fetcher = new Fetcher(logger);
  }

  public readonly text = async (ctx: Context, url: URL, init?: RequestInit): Promise<string> => {
    const path = `${__dirname}/../__fixtures__/Fetcher/${this.slugifyUrl(url)}`;

    return this.fetch(path, ctx, url, init);
  };

  public readonly textPost = async (ctx: Context, url: URL, body: string, init?: RequestInit): Promise<string> => {
    const path = `${__dirname}/../__fixtures__/Fetcher/post-${this.slugifyUrl(url)}-${slugify(body)}`;

    return this.fetch(path, ctx, url, { ...init, method: 'POST', body });
  };

  public readonly head = async (ctx: Context, url: URL, init?: RequestInit): Promise<unknown> => {
    const path = `${__dirname}/../__fixtures__/Fetcher/head-${this.slugifyUrl(url)}`;

    return JSON.parse(await this.fetch(path, ctx, url, { ...init, method: 'HEAD' }));
  };

  private readonly slugifyUrl = (url: URL): string => {
    if (url.href.length > 255) {
      return slugify(`${url.origin}-${crypto.createHash('md5').update(url.href).digest('hex')}`);
    }

    return slugify(url.href);
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
