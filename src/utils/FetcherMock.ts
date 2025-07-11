/* istanbul ignore file */
import crypto from 'crypto';
import fs from 'node:fs';
import CachePolicy from 'http-cache-semantics';
import slugify from 'slugify';
import { RequestInit } from 'undici';
import winston from 'winston';
import { Context } from '../types';
import { envGet } from './env';
import { Fetcher } from './Fetcher';

export class FetcherMock extends Fetcher {
  private readonly fixturePath: string;

  public constructor(fixturePath: string) {
    super(winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] }));

    this.fixturePath = fixturePath;
  }

  public override async text(ctx: Context, url: URL, init?: RequestInit): Promise<string> {
    const path = `${this.fixturePath}/${this.slugifyUrl(url)}`;

    return this.fetch(path, ctx, url, init);
  };

  public override async textPost(ctx: Context, url: URL, body: string, init?: RequestInit): Promise<string> {
    const path = `${this.fixturePath}/post-${this.slugifyUrl(url)}-${slugify(body)}`;

    return this.fetch(path, ctx, url, { ...init, method: 'POST', body });
  };

  public override async head(ctx: Context, url: URL, init?: RequestInit): Promise<CachePolicy.Headers> {
    const path = `${this.fixturePath}/head-${this.slugifyUrl(url)}`;

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
          response = await super.fetchWithTimeout(ctx, url, init);
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
