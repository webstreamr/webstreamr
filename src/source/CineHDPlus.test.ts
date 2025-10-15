import { createTestContext } from '../test';
import { FetcherMock, TmdbId } from '../utils';
import { CineHDPlus } from './CineHDPlus';

const ctx = createTestContext({ es: 'on', mx: 'on' });

describe('CineHDPlus', () => {
  let source: CineHDPlus;

  beforeEach(() => {
    source = new CineHDPlus(new FetcherMock(`${__dirname}/__fixtures__/CineHDPlus`));
  });

  test('handles non-existent series gracefully', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(12345678, 1, 1));
    expect(streams).toHaveLength(0);
  });

  test('handle imdb black mirror s2e3 (mx)', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(42009, 2, 3));
    expect(streams).toMatchSnapshot();
  });

  test('handle imdb babylon 5 s2e3 (es)', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(3137, 2, 3));
    expect(streams).toMatchSnapshot();
  });

  test('does not return mx results for es and vice-versa', async () => {
    const streamsEs = await source.handle({ ...ctx, ...{ config: { es: 'on' } } }, 'series', new TmdbId(42009, 2, 3));
    expect(streamsEs).toHaveLength(0);

    const streamsMx = await source.handle({ ...ctx, ...{ config: { mx: 'on' } } }, 'series', new TmdbId(3137, 2, 3));
    expect(streamsMx).toHaveLength(0);
  });
});
