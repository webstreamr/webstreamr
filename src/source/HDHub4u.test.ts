import { createTestContext } from '../test';
import { FetcherMock, ImdbId } from '../utils';
import { HDHub4u } from './HDHub4u';

const ctx = createTestContext();

describe('HDHub4u', () => {
  let source: HDHub4u;

  beforeEach(() => {
    source = new HDHub4u(new FetcherMock(`${__dirname}/__fixtures__/HDHub4u`));
  });

  test('handle superman 2025', async () => {
    const streams = await source.handle(ctx, 'movie', new ImdbId('tt5950044', undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('handle the bone temple 2026', async () => {
    const streams = await source.handle(ctx, 'movie', new ImdbId('tt32141377', undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('handle stranger things s05e01', async () => {
    const streams = await source.handle(ctx, 'series', new ImdbId('tt4574334', 5, 1));
    expect(streams).toMatchSnapshot();
  });

  test('handle stranger things s05e08', async () => {
    const streams = await source.handle(ctx, 'series', new ImdbId('tt4574334', 5, 8));
    expect(streams).toMatchSnapshot();
  });
});
