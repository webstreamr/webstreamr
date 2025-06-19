import { Frembed } from './Frembed';
import { FetcherMock, ImdbId, TmdbId } from '../utils';
import { createTestContext } from '../test';

const ctx = createTestContext({ fr: 'on' });

describe('Frembed', () => {
  let handler: Frembed;

  beforeEach(() => {
    handler = new Frembed(new FetcherMock(`${__dirname}/__fixtures__/Frembed`));
  });

  test('handle imdb black mirror s4e2', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt2085059', 4, 2));
    expect(streams).toMatchSnapshot();
  });

  test('handle tmdb black mirror s4e2', async () => {
    const streams = await handler.handle(ctx, 'series', new TmdbId(42009, 4, 2));
    expect(streams).toMatchSnapshot();
  });
});
