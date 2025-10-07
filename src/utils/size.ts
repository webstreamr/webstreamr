import { Context } from '../types';
import { CustomRequestInit, Fetcher } from './Fetcher';

export const guessSizeFromMp4 = async (ctx: Context, fetcher: Fetcher, url: URL, init?: CustomRequestInit): Promise<number> => {
  const mp4Head = await fetcher.head(ctx, url, init);

  return parseInt(mp4Head['content-length'] as string);
};
