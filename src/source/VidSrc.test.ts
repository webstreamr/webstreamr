import { VidSrc } from './VidSrc';
import { FetcherMock, ImdbId } from '../utils';
import { createTestContext } from '../test';

const ctx = createTestContext();

describe('VidSrc', () => {
  let handler: VidSrc;

  beforeEach(() => {
    handler = new VidSrc(new FetcherMock('/dev/null'));
  });

  test('handle imdb black mirror s4e2', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt2085059', 4, 2));
    expect(streams).toMatchSnapshot();
  });

  test('handle imdb full metal jacket', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt0093058', undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
