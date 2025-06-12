import { KinoGer } from './KinoGer';
import { Fetcher, ImdbId } from '../utils';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { de: 'on' } };

describe('KinoGer', () => {
  let handler: KinoGer;

  beforeEach(() => {
    handler = new KinoGer(fetcher);
  });

  test('handles non-existent movies gracefully', async () => {
    const streams = await handler.handle(ctx, 'movie', new ImdbId('tt12345678', undefined, undefined));
    expect(streams).toHaveLength(0);
  });

  test('handle non-existent episode gracefully', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt2085059', 99, 99));
    expect(streams).toHaveLength(0);
  });

  test('handle imdb dead city s2e5', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt18546730', 2, 5));
    expect(streams).toMatchSnapshot();
  });

  test('handle imdb dead city s2e6', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt18546730', 2, 6));
    expect(streams).toMatchSnapshot();
  });

  test('handle missing episode imdb black mirror s3e4', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt2085059', 3, 4));
    expect(streams).toMatchSnapshot();
  });

  test('handle no fsst via brokeback mountain', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt0388795', undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('handle imdb blood and sinners', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt31193180', undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
