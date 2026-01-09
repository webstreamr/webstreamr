// eslint-disable-next-line import/no-named-as-default
import KeyvSqlite from '@keyv/sqlite';
import { Cacheable, CacheableMemory, Keyv } from 'cacheable';
import { Context } from '../types';
import { getCacheDir } from './env';
import { CustomRequestConfig, Fetcher } from './Fetcher';

const playlistHeightCache = new Cacheable({
  primary: new Keyv({ store: new CacheableMemory({ lruSize: 16384 }) }),
  secondary: new Keyv(new KeyvSqlite(`sqlite://${getCacheDir()}/webstreamr-playlist-height-cache.sqlite`)),
});

export const guessHeightFromPlaylist = async (ctx: Context, fetcher: Fetcher, playlistUrl: URL, embedUrl: URL, init?: CustomRequestConfig): Promise<number | undefined> => {
  let height = await playlistHeightCache.get<number>(embedUrl.href);
  /* istanbul ignore if */
  if (height) {
    return height;
  }

  let m3u8Data: string;
  try {
    m3u8Data = await fetcher.text(ctx, playlistUrl, init);
  } catch {
    /* istanbul ignore next */
    return undefined;
  }

  const heights = Array.from(m3u8Data.matchAll(/\d+x(\d+)|(\d+)p/g))
    .map(heightMatch => heightMatch[1] ?? heightMatch[2])
    .filter(height => height !== undefined)
    .map(height => parseInt(height));

  height = heights.length ? Math.max(...heights) : /* istanbul ignore next */ undefined;

  await playlistHeightCache.set(embedUrl.href, height, 2628000); // 1 month

  return height;
};
