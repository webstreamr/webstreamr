import winston from 'winston';
import { Frembed } from './Frembed';
import { Fetcher, ImdbId, TmdbId } from '../utils';
import { Context } from '../types';

jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const fetcher = new Fetcher(logger);
const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { fr: 'on' } };

describe('Frembed', () => {
  let handler: Frembed;

  beforeEach(() => {
    handler = new Frembed(fetcher);
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
