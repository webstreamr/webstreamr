/* istanbul ignore file */
import crypto from 'crypto';
import fs from 'node:fs';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import slugify from 'slugify';
import winston from 'winston';
import { NotFoundError } from '../error';
import { Context } from '../types';
import { envGet } from './env';
import { CustomRequestConfig, Fetcher } from './Fetcher';

export class FetcherMock extends Fetcher {
  private readonly fixturePath: string;

  public constructor(fixturePath: string) {
    super(axios, winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] }));

    this.fixturePath = fixturePath;
  }

  public override async fetch(ctx: Context, url: URL, requestConfig?: CustomRequestConfig): Promise<AxiosResponse> {
    let path: string;

    if (requestConfig?.method === 'POST') {
      const data = requestConfig.data as string;
      path = `${this.fixturePath}/post-${this.slugifyUrl(url)}-${slugify(data)}`;
    } else if (requestConfig?.method === 'HEAD') {
      path = `${this.fixturePath}/head-${this.slugifyUrl(url)}`;
    } else {
      path = `${this.fixturePath}/${this.slugifyUrl(url)}`;
    }

    return this.fetchInternal(path, ctx, url, requestConfig);
  };

  public override async text(ctx: Context, url: URL, requestConfig?: CustomRequestConfig): Promise<string> {
    const path = `${this.fixturePath}/${this.slugifyUrl(url)}`;

    return (await this.fetchInternal(path, ctx, url, requestConfig)).data;
  };

  public override async textPost(ctx: Context, url: URL, data: string, requestConfig?: CustomRequestConfig): Promise<string> {
    const path = `${this.fixturePath}/post-${this.slugifyUrl(url)}-${slugify(data)}`;

    return (await this.fetchInternal(path, ctx, url, { ...requestConfig, method: 'POST', data })).data;
  };

  public override async head(ctx: Context, url: URL, init?: CustomRequestConfig): Promise<AxiosResponse['headers']> {
    const path = `${this.fixturePath}/head-${this.slugifyUrl(url)}`;

    return (await this.fetchInternal(path, ctx, url, { ...init, method: 'HEAD' })).headers;
  };

  public override async getFinalRedirectUrl(ctx: Context, url: URL, requestConfig?: CustomRequestConfig, maxCount?: number, count?: number): Promise<URL> {
    const newRequestConfig = { ...requestConfig, method: 'HEAD', maxRedirects: 0 };

    if (count && maxCount && count >= maxCount) {
      return url;
    }

    const response = await this.fetch(ctx, url, newRequestConfig);
    if (response.headers['location']) {
      return await this.getFinalRedirectUrl(ctx, new URL(response.headers['location']), newRequestConfig, maxCount, (count ?? 0) + 1);
    }

    return url;
  }

  private readonly slugifyUrl = (url: URL): string => {
    const slugifiedUrl = slugify(url.href);

    if (slugifiedUrl.length > 249) {
      return slugify(`${url.origin}-${crypto.createHash('md5').update(url.href).digest('hex')}`);
    }

    return slugifiedUrl;
  };

  private readonly fetchInternal = async (path: string, ctx: Context, url: URL, requestConfig?: CustomRequestConfig): Promise<AxiosResponse> => {
    const errorPath = `${path}.error`;

    const isHead = requestConfig?.method === 'HEAD';

    if (fs.existsSync(errorPath)) {
      const message = fs.readFileSync(errorPath).toString();
      if (message.includes('404: Not Found')) {
        throw new NotFoundError(message);
      }

      throw new Error(message);
    } else if (fs.existsSync(path)) {
      const data = fs.readFileSync(path).toString();

      return {
        data: isHead ? '' : data,
        headers: isHead ? JSON.parse(data) : {},
        status: 200,
        statusText: 'OK',
        config: { } as InternalAxiosRequestConfig,
      };
    } else {
      let response;
      try {
        if (envGet('TEST_UPDATE_FIXTURES')) {
          response = await super.fetchWithTimeout(ctx, url, requestConfig);
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
        result = JSON.stringify(response.headers);
      } else {
        result = response.data;
      }

      fs.writeFileSync(path, result);

      return {
        data: isHead ? '' : result,
        headers: isHead ? JSON.parse(result) : {},
        status: 200,
        statusText: 'OK',
        config: { } as InternalAxiosRequestConfig,
      };
    }
  };
}
