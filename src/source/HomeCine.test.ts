import { createTestContext } from '../test';
import { FetcherMock, TmdbId } from '../utils';
import { HomeCine } from './HomeCine';

const ctx = createTestContext({ es: 'on', mx: 'on' });

describe('HomeCine', () => {
  let source: HomeCine;

  beforeEach(() => {
    source = new HomeCine(new FetcherMock(`${__dirname}/__fixtures__/HomeCine`));
  });

  test('handles non-uploaded movie gracefully', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(3176, undefined, undefined));
    expect(streams).toHaveLength(0);
  });

  test('handles non-existent episodes gracefully', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(1402, 1, 99));
    expect(streams).toHaveLength(0);
  });

  test('handle walking dead s1e1', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(1402, 1, 1));
    expect(streams).toMatchSnapshot();
  });

  test('handle el camino', async () => {
    const streams = await source.handle(ctx, 'movie', new TmdbId(559969, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('does not return mx content for es', async () => {
    const streams = await source.handle(createTestContext({ es: 'on' }), 'movie', new TmdbId(559969, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('does not return es content for mx', async () => {
    const streams = await source.handle(createTestContext({ mx: 'on' }), 'movie', new TmdbId(559969, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
