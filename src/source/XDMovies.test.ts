import { createTestContext } from '../test';
import { FetcherMock, TmdbId } from '../utils';
import { XDMovies } from './XDMovies';

const ctx = createTestContext();

describe('XDMovies', () => {
  let source: XDMovies;

  beforeEach(() => {
    source = new XDMovies(new FetcherMock(`${__dirname}/__fixtures__/XDMovies`));
  });

  test('handle non-existent devil\'s bath 2024 gracefully', async () => {
    const streams = await source.handle(ctx, 'movie', new TmdbId(931944, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('handle rathnam 2024', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(1171532, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('handle stranger things s05e08', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(66732, 5, 8));
    expect(streams).toMatchSnapshot();
  });
});
