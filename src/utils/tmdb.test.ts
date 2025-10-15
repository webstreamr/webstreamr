import { createTestContext } from '../test';
import { FetcherMock } from './FetcherMock';
import { ImdbId, TmdbId } from './id';
import { getImdbIdFromTmdbId, getTmdbIdFromImdbId } from './tmdb';

const fetcher = new FetcherMock(`${__dirname}/__fixtures__/tmdb`);
const ctx = createTestContext();

describe('getTmdbIdFromImdbId', () => {
  test('series', async () => {
    const results = await Promise.all([
      getTmdbIdFromImdbId(ctx, fetcher, new ImdbId('tt2085059', 2, 4)),
      getTmdbIdFromImdbId(ctx, fetcher, new ImdbId('tt2085059', 2, 4)),
    ]);
    expect(results[0]).toBeInstanceOf(TmdbId);
    expect(results[0]).toHaveProperty('id', 42009);
    expect(results[0]).toHaveProperty('season', 2);
    expect(results[0]).toHaveProperty('episode', 4);

    // from cache
    const tmdbId = await getTmdbIdFromImdbId(ctx, fetcher, new ImdbId('tt2085059', 2, 4));
    expect(tmdbId).toBeInstanceOf(TmdbId);
    expect(tmdbId).toHaveProperty('id', 42009);
    expect(tmdbId).toHaveProperty('season', 2);
    expect(tmdbId).toHaveProperty('episode', 4);
  });

  test('movie', async () => {
    const results = await Promise.all([
      getTmdbIdFromImdbId(ctx, fetcher, new ImdbId('tt29141112', undefined, undefined)),
      getTmdbIdFromImdbId(ctx, fetcher, new ImdbId('tt29141112', undefined, undefined)),
    ]);

    expect(results[0]).toBeInstanceOf(TmdbId);
    expect(results[0]).toHaveProperty('id', 931944);
    expect(results[0]).toHaveProperty('season', undefined);
    expect(results[0]).toHaveProperty('episode', undefined);

    // from cache
    const tmdbId = await getTmdbIdFromImdbId(ctx, fetcher, new ImdbId('tt29141112', undefined, undefined));
    expect(tmdbId).toBeInstanceOf(TmdbId);
    expect(tmdbId).toHaveProperty('id', 931944);
    expect(tmdbId).toHaveProperty('season', undefined);
    expect(tmdbId).toHaveProperty('episode', undefined);
  });

  test('throws with invalid imdb id', async () => {
    await expect(getTmdbIdFromImdbId(ctx, fetcher, new ImdbId('tt12345678', 1, 1))).rejects.toThrow('Could not get TMDB ID of IMDb ID "tt12345678"');
  });

  test('Monsters: The Lyle and Erik Menendez Story (2024)', async () => {
    expect(await getTmdbIdFromImdbId(ctx, fetcher, new ImdbId('tt13207736', 2, 2))).toStrictEqual(new TmdbId(225634, 1, 2));
  });

  test('Monster: The Ed Gein Story (2025)', async () => {
    expect(await getTmdbIdFromImdbId(ctx, fetcher, new ImdbId('tt13207736', 3, 2))).toStrictEqual(new TmdbId(286801, 1, 2));
  });
});

describe('getImdbIdFromTmdbId', () => {
  test('series', async () => {
    const results = await Promise.all([
      getImdbIdFromTmdbId(ctx, fetcher, new TmdbId(42009, 2, 4)),
      getImdbIdFromTmdbId(ctx, fetcher, new TmdbId(42009, 2, 4)),
    ]);

    expect(results[0]).toBeInstanceOf(ImdbId);
    expect(results[0]).toHaveProperty('id', 'tt2085059');
    expect(results[0]).toHaveProperty('season', 2);
    expect(results[0]).toHaveProperty('episode', 4);

    // from cache
    const imdbId = await getImdbIdFromTmdbId(ctx, fetcher, new TmdbId(42009, 2, 4));
    expect(imdbId).toBeInstanceOf(ImdbId);
    expect(imdbId).toHaveProperty('id', 'tt2085059');
    expect(imdbId).toHaveProperty('season', 2);
    expect(imdbId).toHaveProperty('episode', 4);
  });

  test('movie', async () => {
    const results = await Promise.all([
      getImdbIdFromTmdbId(ctx, fetcher, new TmdbId(931944, undefined, undefined)),
      getImdbIdFromTmdbId(ctx, fetcher, new TmdbId(931944, undefined, undefined)),
    ]);

    expect(results[0]).toBeInstanceOf(ImdbId);
    expect(results[0]).toHaveProperty('id', 'tt29141112');
    expect(results[0]).toHaveProperty('season', undefined);
    expect(results[0]).toHaveProperty('episode', undefined);

    // from cache
    const imdbId = await getImdbIdFromTmdbId(ctx, fetcher, new TmdbId(931944, undefined, undefined));
    expect(imdbId).toBeInstanceOf(ImdbId);
    expect(imdbId).toHaveProperty('id', 'tt29141112');
    expect(imdbId).toHaveProperty('season', undefined);
    expect(imdbId).toHaveProperty('episode', undefined);
  });

  test('throws with invalid tmdb id', async () => {
    await expect(getImdbIdFromTmdbId(ctx, fetcher, new TmdbId(12345678, 1, 1))).rejects.toThrow(Error);
  });
});
