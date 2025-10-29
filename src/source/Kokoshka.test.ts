import { createTestContext } from '../test';
import { FetcherMock, TmdbId } from '../utils';
import { Kokoshka } from './Kokoshka';

const ctx = createTestContext({ al: 'on' });

describe('Kokoshka', () => {
  let source: Kokoshka;

  beforeEach(() => {
    source = new Kokoshka(new FetcherMock(`${__dirname}/__fixtures__/Kokoshka`));
  });

  test('handle non-existent content gracefully', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(287877, 1, 1));
    expect(streams).toMatchSnapshot();
  });

  test('handle non-existent episode gracefully', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(286801, 1, 99));
    expect(streams).toMatchSnapshot();
  });

  test('handle Weapons 2025', async () => {
    const streams = await source.handle(ctx, 'movie', new TmdbId(1078605, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('handle Monster: The Ed Gein Story 2025', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(286801, 1, 3));
    expect(streams).toMatchSnapshot();
  });

  test('handle 5 Herë Jo', async () => {
    const streams = await source.handle(ctx, 'movie', new TmdbId(1213327, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('handle non-existent Steve 2025', async () => {
    const streams = await source.handle(ctx, 'movie', new TmdbId(1242404, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('handle our fault 2025', async () => {
    const streams = await source.handle(ctx, 'movie', new TmdbId(1156594, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
