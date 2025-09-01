import { Context } from '../types';
import { CustomRequestInit, Fetcher } from './Fetcher';

export const guessSizeFromMp4 = async (ctx: Context, fetcher: Fetcher, url: URL, init?: CustomRequestInit): Promise<number | undefined> => {
  const mp4Head = await fetcher.head(ctx, url, init);

  if (mp4Head['content-length']) {
    return parseInt(mp4Head['content-length'] as string);
  }

  return undefined;
};
