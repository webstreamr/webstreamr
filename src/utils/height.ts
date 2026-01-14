import { Context } from '../types';
import { CustomRequestConfig, Fetcher } from './Fetcher';

export const guessHeightFromPlaylist = async (ctx: Context, fetcher: Fetcher, playlistUrl: URL, init?: CustomRequestConfig): Promise<number | undefined> => {
  const m3u8Data = await fetcher.text(ctx, playlistUrl, init);

  const heights = Array.from(m3u8Data.matchAll(/\d+x(\d+)|(\d+)p/g))
    .map(heightMatch => heightMatch[1] ?? heightMatch[2])
    .filter(height => height !== undefined)
    .map(height => parseInt(height));

  return heights.length ? Math.max(...heights) : /* istanbul ignore next */ undefined;
};
