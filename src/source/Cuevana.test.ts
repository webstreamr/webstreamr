import { Cuevana } from './Cuevana';
import { FetcherMock, TmdbId } from '../utils';
import { createTestContext } from '../test';

const ctx = createTestContext({ es: 'on', mx: 'on' });

describe('Cuevana', () => {
  let handler: Cuevana;

  beforeEach(() => {
    handler = new Cuevana(new FetcherMock(`${__dirname}/__fixtures__/Cuevana`));
  });

  test('handles non-existent series gracefully', async () => {
    const streams = await handler.handle(ctx, 'series', new TmdbId(61945, 1, 1));
    expect(streams).toHaveLength(0);
  });

  test('handles non-existent episodes gracefully', async () => {
    const streams = await handler.handle(ctx, 'series', new TmdbId(1402, 1, 99));
    expect(streams).toHaveLength(0);
  });

  test('handle walking dead s1e1', async () => {
    const streams = await handler.handle(ctx, 'series', new TmdbId(1402, 1, 1));
    expect(streams).toMatchSnapshot();
  });

  test('handle la frontera s1e1', async () => {
    const streams = await handler.handle(ctx, 'series', new TmdbId(274980, 1, 1));
    expect(streams).toMatchSnapshot();
  });

  test('handle el camino', async () => {
    const streams = await handler.handle(ctx, 'movie', new TmdbId(559969, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
