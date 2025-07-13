import { createTestContext } from '../test';
import { FetcherMock, TmdbId } from '../utils';
import { Movix } from './Movix';

const ctx = createTestContext({ fr: 'on' });

describe('Movix', () => {
  let handler: Movix;

  beforeEach(() => {
    handler = new Movix(new FetcherMock(`${__dirname}/__fixtures__/Movix`));
  });

  test('handles non-existent content gracefully', async () => {
    const streams = await handler.handle(ctx, 'series', new TmdbId(46080, 1, 999));
    expect(streams).toMatchSnapshot();
  });

  test('handle tmdb black mirror s4e2', async () => {
    const streams = await handler.handle(ctx, 'series', new TmdbId(42009, 4, 2));
    expect(streams).toMatchSnapshot();
  });

  test('handle battle royal', async () => {
    const streams = await handler.handle(ctx, 'movie', new TmdbId(3176, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
