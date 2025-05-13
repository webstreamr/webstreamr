import fs from 'node:fs';
import Axios, { AxiosRequestConfig } from 'axios';
import slugify from 'slugify';
import { Context } from '../../types';

export class Fetcher {
  readonly text = async (_ctx: Context, url: URL, config?: AxiosRequestConfig): Promise<string> => {
    const path = `${__dirname}/../__fixtures__/Fetcher/${slugify(url.href)}`;

    if (fs.existsSync(path)) {
      return fs.readFileSync(path).toString();
    } else {
      const text = (await Axios.create().get(url.href, config)).data;

      fs.writeFileSync(path, text);

      return text;
    }
  };
}
