import winston from 'winston';
import { Frembed } from './Frembed';
import { ExtractorRegistry } from '../extractor';
import { Fetcher } from '../utils';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const handler = new Frembed(fetcher, new ExtractorRegistry(logger, fetcher));
const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { fr: 'on' } };

describe('Frembed', () => {
  test('does not handle non imdb series', async () => {
    const streams = await handler.handle(ctx, 'series', 'kitsu:123');
    expect(streams).toHaveLength(0);
  });

  test('handle imdb black mirror s4e2', async () => {
    const streams = (await handler.handle(ctx, 'series', 'tt2085059:4:2')).filter(stream => stream !== undefined);
    expect(streams).toMatchSnapshot();
  });
});
