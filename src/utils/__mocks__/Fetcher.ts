import fs from 'node:fs';
import Axios, { AxiosError, AxiosRequestConfig, AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';
import slugify from 'slugify';
import { Context } from '../../types';

export class Fetcher {
  readonly text = async (_ctx: Context, url: URL, config?: AxiosRequestConfig): Promise<string> => {
    const path = `${__dirname}/../__fixtures__/Fetcher/${slugify(url.href)}`;

    return this.fixtureWrapper(path, async () => (await Axios.create().get(url.href, this.getConfig(config))).data);
  };

  readonly textPost = async (_ctx: Context, url: URL, data: unknown, config?: AxiosRequestConfig): Promise<string> => {
    const path = `${__dirname}/../__fixtures__/Fetcher/post-${slugify(url.href)}-${slugify(JSON.stringify(data))}`;

    return this.fixtureWrapper(path, async () => (await Axios.create().post(url.href, data, this.getConfig(config))).data);
  };

  readonly head = async (_ctx: Context, url: URL, config?: AxiosRequestConfig): Promise<RawAxiosResponseHeaders | AxiosResponseHeaders> => {
    const path = `${__dirname}/../__fixtures__/Fetcher/head-${slugify(url.href)}`;

    return JSON.parse(await this.fixtureWrapper(path, async () => JSON.stringify((await Axios.create().head(url.href, this.getConfig(config))).headers)));
  };

  private readonly fixtureWrapper = async (path: string, callable: () => Promise<string>): Promise<string> => {
    const errorPath = `${path}.error`;

    if (fs.existsSync(errorPath)) {
      const fixtureError = JSON.parse(fs.readFileSync(errorPath).toString());
      throw new AxiosError(fixtureError.message, fixtureError.code, undefined, undefined, fixtureError.response);
    } else if (fs.existsSync(path)) {
      return fs.readFileSync(path).toString();
    } else {
      let response;

      try {
        response = await callable();
      } catch (error) {
        if (error instanceof AxiosError) {
          const fixtureError = JSON.stringify({
            message: error.message,
            code: error.code,
            ...(error.response && {
              response: {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
              },
            }),
          });
          fs.writeFileSync(errorPath, fixtureError);
        }

        throw error;
      }

      fs.writeFileSync(path, response);

      return response;
    }
  };

  private readonly getConfig = (config?: AxiosRequestConfig): AxiosRequestConfig => {
    return {
      responseType: 'text',
      ...config,
    };
  };
}
