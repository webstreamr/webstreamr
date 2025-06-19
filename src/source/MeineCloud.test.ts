import { MeineCloud } from './MeineCloud';
import { FetcherMock, ImdbId } from '../utils';
import { createTestContext } from '../test';

const ctx = createTestContext({ de: 'on' });

describe('MeineCloud', () => {
  let handler: MeineCloud;

  beforeEach(() => {
    handler = new MeineCloud(new FetcherMock(`${__dirname}/__fixtures__/MeineCloud`));
  });

  test('handles non-existent movies gracefully', async () => {
    const streams = await handler.handle(ctx, 'movie', new ImdbId('tt12345678', undefined, undefined));
    expect(streams).toHaveLength(0);
  });

  test('handle imdb the devil\'s bath', async () => {
    const streams = await handler.handle(ctx, 'movie', new ImdbId('tt29141112', undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
