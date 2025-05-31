import fs from 'node:fs';
import slugify from 'slugify';
import { Context } from '../../types';

export class Fetcher {
  readonly text = async (_ctx: Context, url: URL, init?: RequestInit): Promise<string> => {
    const path = `${__dirname}/../__fixtures__/Fetcher/${slugify(url.href)}`;

    return this.fetchy(path, url, init);
  };

  readonly textPost = async (_ctx: Context, url: URL, data: unknown, init?: RequestInit): Promise<string> => {
    const path = `${__dirname}/../__fixtures__/Fetcher/post-${slugify(url.href)}-${slugify(JSON.stringify(data))}`;

    return this.fetchy(path, url, { ...init, method: 'POST', body: JSON.stringify(data) });
  };

  readonly head = async (_ctx: Context, url: URL, init?: RequestInit): Promise<unknown> => {
    const path = `${__dirname}/../__fixtures__/Fetcher/head-${slugify(url.href)}`;

    return JSON.parse(await this.fetchy(path, url, { ...init, method: 'HEAD' }));
  };

  private readonly fetchy = async (path: string, url: URL, init?: RequestInit): Promise<string> => {
    const errorPath = `${path}.error`;

    if (fs.existsSync(errorPath)) {
      throw new Error(fs.readFileSync(errorPath).toString());
    } else if (fs.existsSync(path)) {
      return fs.readFileSync(path).toString();
    } else {
      let response;
      try {
        if (process.env['TEST_UPDATE_FIXTURES']) {
          response = await fetch(url, init);
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
