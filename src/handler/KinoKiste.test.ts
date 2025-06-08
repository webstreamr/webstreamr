import winston from 'winston';
import { KinoKiste } from './KinoKiste';
import { ExtractorRegistry } from '../extractor';
import { Fetcher, ImdbId } from '../utils';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { de: 'on' } };

describe('KinoKiste', () => {
  let handler: KinoKiste;

  beforeEach(() => {
    handler = new KinoKiste(fetcher, new ExtractorRegistry(logger, fetcher));
  });

  test('handles non-existent series gracefully', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt12345678', 1, 1));
    expect(streams).toHaveLength(0);
  });

  test('handle imdb black mirror s2e4', async () => {
    const streams = (await handler.handle(ctx, 'series', new ImdbId('tt2085059', 2, 4))).filter(stream => stream !== undefined);
    expect(streams).toMatchSnapshot();
  });
});
