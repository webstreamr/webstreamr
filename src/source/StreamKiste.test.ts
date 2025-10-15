import { createTestContext } from '../test';
import { FetcherMock, TmdbId } from '../utils';
import { StreamKiste } from './StreamKiste';

const ctx = createTestContext({ de: 'on' });

describe('StreamKiste', () => {
  let source: StreamKiste;

  beforeEach(() => {
    source = new StreamKiste(new FetcherMock(`${__dirname}/__fixtures__/StreamKiste`));
  });

  test('handles non-existent series gracefully', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(12345678, 1, 1));
    expect(streams).toHaveLength(0);
  });

  test('handle black mirror s2e4', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(42009, 2, 4));
    expect(streams).toMatchSnapshot();
  });

  test('handle monster: the ed gein story s1e2', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(286801, 1, 2));
    expect(streams).toMatchSnapshot();
  });
});
