import { StreamKiste } from './StreamKiste';
import { FetcherMock, ImdbId } from '../utils';
import { createTestContext } from '../test';

const ctx = createTestContext({ de: 'on' });

describe('StreamKiste', () => {
  let handler: StreamKiste;

  beforeEach(() => {
    handler = new StreamKiste(new FetcherMock(`${__dirname}/__fixtures__/StreamKiste`));
  });

  test('handles non-existent series gracefully', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt12345678', 1, 1));
    expect(streams).toHaveLength(0);
  });

  test('handle imdb black mirror s2e4', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt2085059', 2, 4));
    expect(streams).toMatchSnapshot();
  });
});
