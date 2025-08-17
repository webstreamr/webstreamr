import { createTestContext } from '../test';
import { FetcherMock, TmdbId } from '../utils';
import { Movix } from './Movix';

const ctx = createTestContext({ fr: 'on' });

describe('Movix', () => {
  let source: Movix;

  beforeEach(() => {
    source = new Movix(new FetcherMock(`${__dirname}/__fixtures__/Movix`));
  });

  test('handles non-existent show gracefully', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(46080, 1, 999));
    expect(streams).toMatchSnapshot();
  });

  test('handles non-existent movie gracefully', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(548473, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('handle tmdb black mirror s4e2', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(42009, 4, 2));
    expect(streams).toMatchSnapshot();
  });

  test('handle battle royal', async () => {
    const streams = await source.handle(ctx, 'movie', new TmdbId(3176, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
