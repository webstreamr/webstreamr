import { Context } from '../types';
import { CustomRequestInit, Fetcher } from './Fetcher';

export const guessHeightFromTitle = (title: string): number | undefined => {
  const heightMatch = title.match(/([0-9]+)p/);
  if (heightMatch && heightMatch[1]) {
    return parseInt(heightMatch[1]);
  }

  return undefined;
};

export const guessHeightFromPlaylist = async (ctx: Context, fetcher: Fetcher, url: URL, init?: CustomRequestInit): Promise<number | undefined> => {
  const m3u8Data = await fetcher.text(ctx, url, init);

  const heights = Array.from(m3u8Data.matchAll(/\d+x(\d+)|(\d+)p/g))
    .map(heightMatch => heightMatch[1] ?? heightMatch[2])
    .filter(height => height !== undefined)
    .map(height => parseInt(height));

  /* istanbul ignore next We don't have a source that returns playlists with no resolution atm. */
  return heights.length ? Math.max(...heights) : undefined;
};
