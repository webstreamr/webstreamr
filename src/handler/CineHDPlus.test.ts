import winston from 'winston';
import { CineHDPlus } from './CineHDPlus';
import { ExtractorRegistry } from '../extractor';
import { Fetcher } from '../utils';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const handler = new CineHDPlus(fetcher, new ExtractorRegistry(logger, fetcher));
const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { es: 'on', mx: 'on' } };

describe('CineHDPlus', () => {
  test('does not handle non imdb series', async () => {
    const streams = await handler.handle(ctx, 'series', 'kitsu:123');
    expect(streams).toHaveLength(0);
  });

  test('handles non-existent series gracefully', async () => {
    const streams = await handler.handle(ctx, 'series', 'tt12345678:1:1');
    expect(streams).toHaveLength(0);
  });

  test('handle imdb black mirror s2e3 (mx)', async () => {
    const streams = (await handler.handle(ctx, 'series', 'tt2085059:2:3')).filter(stream => stream !== undefined);
    expect(streams).toMatchSnapshot();
  });

  test('handle imdb babylon 5 s2e3 (es)', async () => {
    const streams = (await handler.handle(ctx, 'series', 'tt0105946:2:3')).filter(stream => stream !== undefined);
    expect(streams).toMatchSnapshot();
  });

  test('does not return mx results for es and vice-versa', async () => {
    const streamsEs = (await handler.handle({ ...ctx, ...{ config: { es: 'on' } } }, 'series', 'tt2085059:2:3')).filter(stream => stream !== undefined);
    expect(streamsEs).toHaveLength(0);

    const streamsMx = (await handler.handle({ ...ctx, ...{ config: { mx: 'on' } } }, 'series', 'tt0105946:2:3')).filter(stream => stream !== undefined);
    expect(streamsMx).toHaveLength(0);
  });
});
