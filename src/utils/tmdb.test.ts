import { getTmdbIdFromImdbId } from './tmdb';
import { Fetcher } from './Fetcher';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { de: 'on' } };

describe('getTmdbIdFromImdbId', () => {
  test('series', async () => {
    const tmdbId = await getTmdbIdFromImdbId(ctx, fetcher, { id: 'tt2085059', series: 2, episode: 4 });

    expect(tmdbId).toStrictEqual({
      id: 42009,
      series: 2,
      episode: 4,
    });
  });

  test('movie', async () => {
    const tmdbId = await getTmdbIdFromImdbId(ctx, fetcher, { id: 'tt29141112', series: undefined, episode: undefined });

    expect(tmdbId).toStrictEqual({
      id: 931944,
      series: undefined,
      episode: undefined,
    });
  });

  test('throws with invalid imdb id', async () => {
    await expect(getTmdbIdFromImdbId(ctx, fetcher, { id: 'tt12345678', series: 1, episode: 1 })).rejects.toThrow('Could not get TMDB ID of IMDb ID "tt12345678"');
  });
});
