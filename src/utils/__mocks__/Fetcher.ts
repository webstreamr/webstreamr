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
      const text = (await Axios.create().get(url.href, this.getConfig(config))).data;

      fs.writeFileSync(path, text);

      return text;
    }
  };

  readonly textPost = async (_ctx: Context, url: URL, data: unknown, config?: AxiosRequestConfig): Promise<string> => {
    const path = `${__dirname}/../__fixtures__/Fetcher/post-${slugify(url.href)}-${slugify(JSON.stringify(data))}`;

    if (fs.existsSync(path)) {
      return fs.readFileSync(path).toString();
    } else {
      const text = (await Axios.create().post(url.href, data, this.getConfig(config))).data;

      fs.writeFileSync(path, text);

      return text;
    }
  };

  private readonly getConfig = (config?: AxiosRequestConfig): AxiosRequestConfig => {
    return {
      responseType: 'text',
      ...config,
    };
  };
}
