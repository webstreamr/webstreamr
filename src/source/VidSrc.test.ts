import winston from 'winston';
import { VidSrc } from './VidSrc';
import { Fetcher, ImdbId } from '../utils';
import { Context } from '../types';

jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const fetcher = new Fetcher(logger);
const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { en: 'on' } };

describe('VidSrc', () => {
  let handler: VidSrc;

  beforeEach(() => {
    handler = new VidSrc(fetcher);
  });

  test('handle imdb black mirror s4e2', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt2085059', 4, 2));
    expect(streams).toMatchSnapshot();
  });

  test('handle imdb full metal jacket', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt0093058', undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
