import { Context } from '../types';
import { CustomRequestInit, Fetcher } from './Fetcher';

export const guessHeightFromPlaylist = async (ctx: Context, fetcher: Fetcher, url: URL, init?: CustomRequestInit): Promise<number | undefined> => {
  const m3u8Data = await fetcher.text(ctx, url, init);

  const heights = Array.from(m3u8Data.matchAll(/\d+x(\d+)|(\d+)p/g))
    .map(heightMatch => heightMatch[1] ?? heightMatch[2])
    .filter(height => height !== undefined)
    .map(height => parseInt(height));

  return heights.length ? Math.max(...heights) : /* istanbul ignore next */ undefined;
};
