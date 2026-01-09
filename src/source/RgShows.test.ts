import { createTestContext } from '../test';
import { FetcherMock, TmdbId } from '../utils';
import { RgShows } from './RgShows';

const ctx = createTestContext();

describe('RgShows', () => {
  let source: RgShows;

  beforeEach(() => {
    source = new RgShows(new FetcherMock(`${__dirname}/__fixtures__/RgShows`));
  });

  test('handle stranger things s05e01', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(66732, 5, 1));
    expect(streams).toMatchSnapshot();
  });

  test('handle one battle after another', async () => {
    const streams = await source.handle(ctx, 'movie', new TmdbId(1054867, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
