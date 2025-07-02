import { createTestContext } from '../test';
import { FetcherMock, ImdbId, TmdbId } from '../utils';
import { Soaper } from './Soaper';

const ctx = createTestContext();

describe('Soaper', () => {
  let handler: Soaper;

  beforeEach(() => {
    handler = new Soaper(new FetcherMock(`${__dirname}/__fixtures__/Soaper`));
  });

  test('handles non-existent movies gracefully', async () => {
    const streams = await handler.handle(ctx, 'movie', new ImdbId('tt12345678', undefined, undefined));
    expect(streams).toHaveLength(0);
  });

  test('handle non-uploaded movie gracefully', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt29141112', undefined, undefined));
    expect(streams).toHaveLength(0);
  });

  test('handle non-existent episode gracefully', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt2085059', 99, 99));
    expect(streams).toHaveLength(0);
  });

  test('handle imdb black mirror s4e2', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt2085059', 4, 2));
    expect(streams).toMatchSnapshot();
  });

  test('handle tmdb black mirror s4e2', async () => {
    const streams = await handler.handle(ctx, 'series', new TmdbId(42009, 4, 2));
    expect(streams).toMatchSnapshot();
  });

  test('handle imdb full metal jacket', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt0093058', undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
