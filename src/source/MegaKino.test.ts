import { createTestContext } from '../test';
import { FetcherMock, ImdbId } from '../utils';
import { MegaKino } from './MegaKino';

const ctx = createTestContext({ de: 'on' });

describe('MegaKino', () => {
  let handler: MegaKino;

  beforeEach(() => {
    handler = new MegaKino(new FetcherMock(`${__dirname}/__fixtures__/MegaKino`));
  });

  test('handles non-existent movies gracefully', async () => {
    const streams = await handler.handle(ctx, 'movie', new ImdbId('tt12345678', undefined, undefined));
    expect(streams).toHaveLength(0);
  });

  test('handle imdb baymax', async () => {
    const streams = await handler.handle(ctx, 'movie', new ImdbId('tt2245084', undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
