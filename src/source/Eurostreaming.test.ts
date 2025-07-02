import { createTestContext } from '../test';
import { FetcherMock, TmdbId } from '../utils';
import { Eurostreaming } from './Eurostreaming';

const ctx = createTestContext({ it: 'on' });

describe('Eurostreaming', () => {
  let handler: Eurostreaming;

  beforeEach(() => {
    handler = new Eurostreaming(new FetcherMock(`${__dirname}/__fixtures__/Eurostreaming`));
  });

  test('handles non-existent series gracefully', async () => {
    const streams = await handler.handle(ctx, 'series', new TmdbId(61945, 1, 1));
    expect(streams).toHaveLength(0);
  });

  test('handle imdb black mirror s2e4', async () => {
    const streams = await handler.handle(ctx, 'series', new TmdbId(42009, 2, 4));
    expect(streams).toMatchSnapshot();
  });

  test('handle lost s1e1', async () => {
    const streams = await handler.handle(ctx, 'series', new TmdbId(4607, 1, 1));
    expect(streams).toMatchSnapshot();
  });

  test('last of us s1e1', async () => {
    const streams = await handler.handle(ctx, 'series', new TmdbId(100088, 1, 1));
    expect(streams).toMatchSnapshot();
  });

  test('game of thrones s1e1', async () => {
    const streams = await handler.handle(ctx, 'series', new TmdbId(1399, 1, 1));
    expect(streams).toMatchSnapshot();
  });
});
