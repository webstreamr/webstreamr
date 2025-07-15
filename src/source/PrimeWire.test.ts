import { createTestContext } from '../test';
import { FetcherMock, ImdbId } from '../utils';
import { PrimeWire } from './PrimeWire';

const ctx = createTestContext({ en: 'on' });

describe('PrimeWire', () => {
  let handler: PrimeWire;

  beforeEach(() => {
    handler = new PrimeWire(new FetcherMock(`${__dirname}/__fixtures__/PrimeWire`));
  });

  test('handle non-existent movie gracefully', async () => {
    const streams = await handler.handle(ctx, 'movie', new ImdbId('tt12345678', undefined, undefined));
    expect(streams).toHaveLength(0);
  });

  test('handle non-existent episode gracefully', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt18546730', 99, 99));
    expect(streams).toHaveLength(0);
  });

  test('handle imdb dead city s2e5', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt18546730', 2, 5));
    expect(streams).toMatchSnapshot();
  });

  test('handle el camino', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt9243946', undefined, undefined));
    expect(streams).toMatchSnapshot();

    // Should be using the redirectUrlCache
    const streams2 = await handler.handle(ctx, 'series', new ImdbId('tt9243946', undefined, undefined));
    expect(streams2).toMatchSnapshot();
  });
});
