import { createTestContext } from '../test';
import { FetcherMock, TmdbId } from '../utils';
import { Cuevana } from './Cuevana';

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

  test('does not return mx content for es', async () => {
    const streams = await handler.handle(createTestContext({ es: 'on' }), 'movie', new TmdbId(559969, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('does not return es content for mx', async () => {
    const streams = await handler.handle(createTestContext({ mx: 'on' }), 'movie', new TmdbId(559969, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
