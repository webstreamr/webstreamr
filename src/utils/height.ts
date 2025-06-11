import { Fetcher } from './Fetcher';
import { Context } from '../types';

export const guessFromTitle = (title: string): number | undefined => {
  const heightMatch = title.match(/([0-9]+)p/);
  if (heightMatch && heightMatch[1]) {
    return parseInt(heightMatch[1]);
  }

  return undefined;
};

export const guessFromPlaylist = async (ctx: Context, fetcher: Fetcher, url: URL): Promise<number | undefined> => {
  const m3u8Data = await fetcher.text(ctx, url);

  const heights = Array.from(m3u8Data.matchAll(/\d+x(\d+)|(\d+)p/g))
    .map(heightMatch => heightMatch[1] ?? heightMatch[2])
    .filter(height => height !== undefined)
    .map(height => parseInt(height));

  return Math.max(...heights);
};
