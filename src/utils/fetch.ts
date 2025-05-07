import makeFetchHappen from 'make-fetch-happen';
import { FetchInterface, FetchOptions } from 'make-fetch-happen';
import fs from 'node:fs';
import * as os from 'node:os';
import { Response } from 'node-fetch';
import { logInfo } from './log';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class MakeFetchHappenSingleton {
  private static instance: FetchInterface;

  public static getInstance(): FetchInterface {
    if (!MakeFetchHappenSingleton.instance) {
      MakeFetchHappenSingleton.instance = makeFetchHappen.defaults({
        cachePath: `${fs.realpathSync(os.tmpdir())}/webstreamr`,
      });
    }
    return MakeFetchHappenSingleton.instance;
  }
}

const cachedFetch = async (uriOrRequest: string | Request, opts?: FetchOptions): Promise<Response> => {
  logInfo(`Fetch ${uriOrRequest}`);

  const fetch = MakeFetchHappenSingleton.getInstance();

  return await fetch(uriOrRequest, opts);
};

export const cachedFetchText = async (uriOrRequest: string | Request, opts?: FetchOptions): Promise<string> => {
  const response = await cachedFetch(uriOrRequest, opts);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
  }

  return await response.text();
};
