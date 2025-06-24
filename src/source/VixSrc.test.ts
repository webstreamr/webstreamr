import { VixSrc } from './VixSrc';
import { FetcherMock, ImdbId } from '../utils';
import { createTestContext } from '../test';

const ctx = createTestContext();

describe('VixSrc', () => {
  let handler: VixSrc;

  beforeEach(() => {
    handler = new VixSrc(new FetcherMock(`${__dirname}/__fixtures__/VixSrc`));
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
