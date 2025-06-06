import { getImdbIdFromTmdbId, getTmdbIdFromImdbId, parseTmdbId } from './tmdb';
import { Fetcher } from './Fetcher';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { de: 'on' } };

describe('tmdb id parsing', () => {
  test('splits id properly', () => {
    const { id, series, episode } = parseTmdbId('2085059:2:4');

    expect(id).toBe(2085059);
    expect(series).toBe(2);
    expect(episode).toBe(4);
  });

  test('handles weird 0 prefixes in series and episode', () => {
    const { id, series, episode } = parseTmdbId('2085059:02:04');

    expect(id).toBe(2085059);
    expect(series).toBe(2);
    expect(episode).toBe(4);
  });

  test('supports movie with missing series and episode', () => {
    const { id, series, episode } = parseTmdbId('2085059');

    expect(id).toBe(2085059);
    expect(series).toBeUndefined();
    expect(episode).toBeUndefined();
  });

  test('throws for empty ids', () => {
    expect(() => {
      parseTmdbId('');
    }).toThrow('TMDB ID "" is invalid');
  });

  test('throws for invalid ids', () => {
    expect(() => {
      parseTmdbId('foo');
    }).toThrow('TMDB ID "foo" is invalid');
  });
});

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
