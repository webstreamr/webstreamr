import { createTestContext } from '../test';
import { FetcherMock } from './FetcherMock';
import { ImdbId, TmdbId } from './id';
import { getImdbIdFromTmdbId, getTmdbIdFromImdbId } from './tmdb';

const fetcher = new FetcherMock(`${__dirname}/__fixtures__/tmdb`);
const ctx = createTestContext();

describe('getTmdbIdFromImdbId', () => {
  test('series', async () => {
    const tmdbId1 = await getTmdbIdFromImdbId(ctx, fetcher, new ImdbId('tt2085059', 2, 4));
    expect(tmdbId1).toBeInstanceOf(TmdbId);
    expect(tmdbId1).toHaveProperty('id', 42009);
    expect(tmdbId1).toHaveProperty('season', 2);
    expect(tmdbId1).toHaveProperty('episode', 4);

    // from cache
    const tmdbId2 = await getTmdbIdFromImdbId(ctx, fetcher, new ImdbId('tt2085059', 2, 4));
    expect(tmdbId2).toBeInstanceOf(TmdbId);
    expect(tmdbId2).toHaveProperty('id', 42009);
    expect(tmdbId2).toHaveProperty('season', 2);
    expect(tmdbId2).toHaveProperty('episode', 4);
  });

  test('movie', async () => {
    const tmdbId1 = await getTmdbIdFromImdbId(ctx, fetcher, new ImdbId('tt29141112', undefined, undefined));
    expect(tmdbId1).toBeInstanceOf(TmdbId);
    expect(tmdbId1).toHaveProperty('id', 931944);
    expect(tmdbId1).toHaveProperty('season', undefined);
    expect(tmdbId1).toHaveProperty('episode', undefined);

    // from cache
    const tmdbId2 = await getTmdbIdFromImdbId(ctx, fetcher, new ImdbId('tt29141112', undefined, undefined));
    expect(tmdbId2).toBeInstanceOf(TmdbId);
    expect(tmdbId2).toHaveProperty('id', 931944);
    expect(tmdbId2).toHaveProperty('season', undefined);
    expect(tmdbId2).toHaveProperty('episode', undefined);
  });

  test('throws with invalid imdb id', async () => {
    await expect(getTmdbIdFromImdbId(ctx, fetcher, new ImdbId('tt12345678', 1, 1))).rejects.toThrow('Could not get TMDB ID of IMDb ID "tt12345678"');
  });
});

describe('getImdbIdFromTmdbId', () => {
  test('series', async () => {
    const imdbId1 = await getImdbIdFromTmdbId(ctx, fetcher, new TmdbId(42009, 2, 4));
    expect(imdbId1).toBeInstanceOf(ImdbId);
    expect(imdbId1).toHaveProperty('id', 'tt2085059');
    expect(imdbId1).toHaveProperty('season', 2);
    expect(imdbId1).toHaveProperty('episode', 4);

    // from cache
    const imdbId2 = await getImdbIdFromTmdbId(ctx, fetcher, new TmdbId(42009, 2, 4));
    expect(imdbId2).toBeInstanceOf(ImdbId);
    expect(imdbId2).toHaveProperty('id', 'tt2085059');
    expect(imdbId2).toHaveProperty('season', 2);
    expect(imdbId2).toHaveProperty('episode', 4);
  });

  test('movie', async () => {
    const imdbId1 = await getImdbIdFromTmdbId(ctx, fetcher, new TmdbId(931944, undefined, undefined));
    expect(imdbId1).toBeInstanceOf(ImdbId);
    expect(imdbId1).toHaveProperty('id', 'tt29141112');
    expect(imdbId1).toHaveProperty('season', undefined);
    expect(imdbId1).toHaveProperty('episode', undefined);

    // from cache
    const imdbId2 = await getImdbIdFromTmdbId(ctx, fetcher, new TmdbId(931944, undefined, undefined));
    expect(imdbId2).toBeInstanceOf(ImdbId);
    expect(imdbId2).toHaveProperty('id', 'tt29141112');
    expect(imdbId2).toHaveProperty('season', undefined);
    expect(imdbId2).toHaveProperty('episode', undefined);
  });

  test('throws with invalid tmdb id', async () => {
    await expect(getImdbIdFromTmdbId(ctx, fetcher, new TmdbId(12345678, 1, 1))).rejects.toThrow(Error);
  });
});
