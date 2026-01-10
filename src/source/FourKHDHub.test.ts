import { createTestContext } from '../test';
import { FetcherMock, TmdbId } from '../utils';
import { FourKHDHub } from './FourKHDHub';

const ctx = createTestContext();

describe('FourKHDHub', () => {
  let source: FourKHDHub;

  beforeEach(() => {
    source = new FourKHDHub(new FetcherMock(`${__dirname}/__fixtures__/FourKHDHub`));
  });

  test('handle non-existent devil\'s bath 2024 gracefully', async () => {
    const streams = await source.handle(ctx, 'movie', new TmdbId(931944, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('handle superman 2025', async () => {
    const streams = await source.handle(ctx, 'movie', new TmdbId(1061474, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('handle dark 2017 s01e02', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(70523, 1, 2));
    expect(streams).toMatchSnapshot();
  });

  test('handle dexter resurrection 2025 s01e01', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(259909, 1, 1));
    expect(streams).toMatchSnapshot();
  });

  test('handle dexter original sin 2024 s01e01', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(219937, 1, 1));
    expect(streams).toMatchSnapshot();
  });

  test('handle crayon shin-chan 1993', async () => {
    const streams = await source.handle(ctx, 'movie', new TmdbId(128868, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('handle crayon shin-chan 1998', async () => {
    const streams = await source.handle(ctx, 'movie', new TmdbId(128875, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('handle crank 2006', async () => {
    const streams = await source.handle(ctx, 'movie', new TmdbId(1948, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('handle lovely runner 2024 s01e01', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(230923, 1, 1));
    expect(streams).toMatchSnapshot();
  });

  test('handle stranger things s05e08', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(66732, 5, 8));
    expect(streams).toMatchSnapshot();
  });

  test('handle f1', async () => {
    const streams = await source.handle(ctx, 'movie', new TmdbId(911430, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('handle the tank', async () => {
    const streams = await source.handle(ctx, 'movie', new TmdbId(1252037, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
