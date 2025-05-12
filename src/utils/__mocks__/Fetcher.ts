import { FetchOptions } from 'make-fetch-happen';
import makeFetchHappen from 'make-fetch-happen';
import fs from 'node:fs';
import slugify from 'slugify';
import { Context } from '../../types';

export class Fetcher {
  readonly text = async (_ctx: Context, url: URL, opts?: FetchOptions): Promise<string> => {
    const path = `${__dirname}/../__fixtures__/Fetcher/${slugify(url.href)}`;

    if (fs.existsSync(path)) {
      return fs.readFileSync(path).toString();
    } else {
      const text = await (await makeFetchHappen.defaults()(url.href, opts)).text();

      fs.writeFileSync(path, text);

      return text;
    }
  };
}
