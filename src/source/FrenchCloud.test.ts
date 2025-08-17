import { createTestContext } from '../test';
import { FetcherMock, ImdbId } from '../utils';
import { FrenchCloud } from './FrenchCloud';

const ctx = createTestContext({ fr: 'on' });

describe('FrenchCloud', () => {
  let source: FrenchCloud;

  beforeEach(() => {
    source = new FrenchCloud(new FetcherMock(`${__dirname}/__fixtures__/FrenchCloud`));
  });

  test('handles non-existent movies gracefully', async () => {
    const streams = await source.handle(ctx, 'movie', new ImdbId('tt12345678', undefined, undefined));
    expect(streams).toHaveLength(0);
  });

  test('handle imdb the devil\'s bath', async () => {
    const streams = await source.handle(ctx, 'movie', new ImdbId('tt29141112', undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
