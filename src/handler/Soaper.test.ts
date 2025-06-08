import winston from 'winston';
import { Soaper } from './Soaper';
import { Fetcher, ImdbId, TmdbId } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const handler = new Soaper(fetcher, new ExtractorRegistry(logger, fetcher));
const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { en: 'on' } };

describe('Soaper', () => {
  test('handles non-existent movies gracefully', async () => {
    const streams = await handler.handle(ctx, 'movie', new ImdbId('tt12345678', undefined, undefined));
    expect(streams).toHaveLength(0);
  });

  test('handle non-uploaded movie gracefully', async () => {
    const streams = (await handler.handle(ctx, 'series', new ImdbId('tt29141112', undefined, undefined))).filter(stream => stream !== undefined);
    expect(streams).toHaveLength(0);
  });

  test('handle non-existent episode gracefully', async () => {
    const streams = (await handler.handle(ctx, 'series', new ImdbId('tt2085059', 99, 99))).filter(stream => stream !== undefined);
    expect(streams).toHaveLength(0);
  });

  test('handle imdb black mirror s4e2', async () => {
    const streams = (await handler.handle(ctx, 'series', new ImdbId('tt2085059', 4, 2))).filter(stream => stream !== undefined);
    expect(streams).toMatchSnapshot();
  });

  test('handle tmdb black mirror s4e2', async () => {
    const streams = (await handler.handle(ctx, 'series', new TmdbId(42009, 4, 2))).filter(stream => stream !== undefined);

    const streamsWithoutTtl = streams.map((stream) => {
      delete stream.ttl;
      return stream;
    }); // to avoid flakyness because this is served from cache with lower ttl :)

    expect(streamsWithoutTtl).toMatchSnapshot();
  });

  test('handle imdb full metal jacket', async () => {
    const streams = (await handler.handle(ctx, 'series', new ImdbId('tt0093058', undefined, undefined))).filter(stream => stream !== undefined);
    expect(streams).toMatchSnapshot();
  });
});
