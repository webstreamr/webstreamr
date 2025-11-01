/* istanbul ignore file */
import crypto from 'crypto';
import fs from 'node:fs';
import CachePolicy from 'http-cache-semantics';
import slugify from 'slugify';
import { RequestInit } from 'undici';
import winston from 'winston';
import { NotFoundError } from '../error';
import { Context } from '../types';
import { envGet } from './env';
import { Fetcher, HttpCacheItem } from './Fetcher';

export class FetcherMock extends Fetcher {
  private readonly fixturePath: string;

  public constructor(fixturePath: string) {
    super(winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] }));

    this.fixturePath = fixturePath;
  }

  public override async fetch(ctx: Context, url: URL, init?: RequestInit): Promise<HttpCacheItem> {
    let path: string;

    if (init?.method === 'POST') {
      const body = init.body as string;
      path = `${this.fixturePath}/post-${this.slugifyUrl(url)}-${slugify(body)}`;
    } else if (init?.method === 'HEAD') {
      path = `${this.fixturePath}/head-${this.slugifyUrl(url)}`;
    } else {
      path = `${this.fixturePath}/${this.slugifyUrl(url)}`;
    }

    return this.fetchInternal(path, ctx, url, init);
  };

  public override async text(ctx: Context, url: URL, init?: RequestInit): Promise<string> {
    const path = `${this.fixturePath}/${this.slugifyUrl(url)}`;

    return (await this.fetchInternal(path, ctx, url, init)).body;
  };

  public override async textPost(ctx: Context, url: URL, body: string, init?: RequestInit): Promise<string> {
    const path = `${this.fixturePath}/post-${this.slugifyUrl(url)}-${slugify(body)}`;

    return (await this.fetchInternal(path, ctx, url, { ...init, method: 'POST', body })).body;
  };

  public override async head(ctx: Context, url: URL, init?: RequestInit): Promise<CachePolicy.Headers> {
    const path = `${this.fixturePath}/head-${this.slugifyUrl(url)}`;

    return (await this.fetchInternal(path, ctx, url, { ...init, method: 'HEAD' })).headers;
  };

  private readonly slugifyUrl = (url: URL): string => {
    const slugifiedUrl = slugify(url.href);

    if (slugifiedUrl.length > 249) {
      return slugify(`${url.origin}-${crypto.createHash('md5').update(url.href).digest('hex')}`);
    }

    return slugifiedUrl;
  };

  private readonly fetchInternal = async (path: string, ctx: Context, url: URL, init?: RequestInit): Promise<HttpCacheItem> => {
    const errorPath = `${path}.error`;

    const isHead = init?.method === 'HEAD';

    if (fs.existsSync(errorPath)) {
      const message = fs.readFileSync(errorPath).toString();
      if (message.includes('404: Not Found')) {
        throw new NotFoundError(message);
      }

      throw new Error(message);
    } else if (fs.existsSync(path)) {
      const data = fs.readFileSync(path).toString();

      return {
        body: isHead ? '' : data,
        headers: isHead ? JSON.parse(data) : {},
        status: 200,
        statusText: 'OK',
        ttl: 0,
        url: url.href,
      };
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

      if (response.status < 200 || response.status > 399) {
        const message = `Fetcher error: ${response.status}: ${response.statusText}`;
        fs.writeFileSync(errorPath, message);
        throw new Error(message);
      }

      let result;
      if (isHead) {
        const headers: Record<string, string> = {};

        response.headers.forEach((value, key) => {
          headers[key] = value;
        });

        result = JSON.stringify(headers);
      } else {
        result = await response.text();
      }

      fs.writeFileSync(path, result);

      return {
        body: isHead ? '' : result,
        headers: isHead ? JSON.parse(result) : {},
        status: 200,
        statusText: 'OK',
        ttl: 0,
        url: url.href,
      };
    }
  };
}
