import { CineHDPlus } from './CineHDPlus';
import { FetcherMock, ImdbId } from '../utils';
import { Context } from '../types';

const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { es: 'on', mx: 'on' } };

describe('CineHDPlus', () => {
  let handler: CineHDPlus;

  beforeEach(() => {
    handler = new CineHDPlus(new FetcherMock());
  });

  test('handles non-existent series gracefully', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt12345678', 1, 1));
    expect(streams).toHaveLength(0);
  });

  test('handle imdb black mirror s2e3 (mx)', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt2085059', 2, 3));
    expect(streams).toMatchSnapshot();
  });

  test('handle imdb babylon 5 s2e3 (es)', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt0105946', 2, 3));
    expect(streams).toMatchSnapshot();
  });

  test('does not return mx results for es and vice-versa', async () => {
    const streamsEs = await handler.handle({ ...ctx, ...{ config: { es: 'on' } } }, 'series', new ImdbId('tt2085059', 2, 3));
    expect(streamsEs).toHaveLength(0);

    const streamsMx = await handler.handle({ ...ctx, ...{ config: { mx: 'on' } } }, 'series', new ImdbId('tt0105946', 2, 3));
    expect(streamsMx).toHaveLength(0);
  });
});
