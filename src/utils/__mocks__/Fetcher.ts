import { FetchOptions } from 'make-fetch-happen';
import makeFetchHappen from 'make-fetch-happen';
import fs from 'node:fs';
import slugify from 'slugify';

export class Fetcher {
  readonly text = async (uriOrRequest: string, opts?: FetchOptions): Promise<string> => {
    const path = `${__dirname}/../__fixtures__/Fetcher/${slugify(uriOrRequest)}`;

    if (fs.existsSync(path)) {
      return fs.readFileSync(path).toString();
    } else {
      const text = await (await makeFetchHappen.defaults()(uriOrRequest, opts)).text();

      fs.writeFileSync(path, text);

      return text;
    }
  };
}
