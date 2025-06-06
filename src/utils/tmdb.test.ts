import { getImdbIdFromTmdbId, getTmdbIdFromImdbId } from './tmdb';
import { Fetcher } from './Fetcher';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { de: 'on' } };

describe('getTmdbIdFromImdbId', () => {
  test('series', async () => {
    expect(await getTmdbIdFromImdbId(ctx, fetcher, { id: 'tt2085059', series: 2, episode: 4 }))
      .toStrictEqual({ id: 42009, series: 2, episode: 4 });
    expect(await getTmdbIdFromImdbId(ctx, fetcher, { id: 'tt2085059', series: 2, episode: 4 }))
      .toStrictEqual({ id: 42009, series: 2, episode: 4 }); // from cache
  });

  test('movie', async () => {
    expect(await getTmdbIdFromImdbId(ctx, fetcher, { id: 'tt29141112', series: undefined, episode: undefined }))
      .toStrictEqual({ id: 931944, series: undefined, episode: undefined });
    expect(await getTmdbIdFromImdbId(ctx, fetcher, { id: 'tt29141112', series: undefined, episode: undefined }))
      .toStrictEqual({ id: 931944, series: undefined, episode: undefined }); // from cache
  });

  test('throws with invalid imdb id', async () => {
    await expect(getTmdbIdFromImdbId(ctx, fetcher, { id: 'tt12345678', series: 1, episode: 1 })).rejects.toThrow('Could not get TMDB ID of IMDb ID "tt12345678"');
  });
});

describe('getImdbIdFromTmdbId', () => {
  test('series', async () => {
    expect(await getImdbIdFromTmdbId(ctx, fetcher, { id: 42009, series: 2, episode: 4 }))
      .toStrictEqual({ id: 'tt2085059', series: 2, episode: 4 });
    expect(await getImdbIdFromTmdbId(ctx, fetcher, { id: 42009, series: 2, episode: 4 }))
      .toStrictEqual({ id: 'tt2085059', series: 2, episode: 4 }); // from cache
  });

  test('movie', async () => {
    expect(await getImdbIdFromTmdbId(ctx, fetcher, { id: 931944, series: undefined, episode: undefined }))
      .toStrictEqual({ id: 'tt29141112', series: undefined, episode: undefined });
    expect(await getImdbIdFromTmdbId(ctx, fetcher, { id: 931944, series: undefined, episode: undefined }))
      .toStrictEqual({ id: 'tt29141112', series: undefined, episode: undefined }); // from cache
  });

  test('throws with invalid tmdb id', async () => {
    await expect(getImdbIdFromTmdbId(ctx, fetcher, { id: 12345678, series: 1, episode: 1 })).rejects.toThrow(Error);
  });
});
