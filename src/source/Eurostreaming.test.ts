import winston from 'winston';
import { Eurostreaming } from './Eurostreaming';
import { Fetcher, ImdbId } from '../utils';
import { Context } from '../types';

jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const fetcher = new Fetcher(logger);
const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { it: 'on' } };

describe('Eurostreaming', () => {
  let handler: Eurostreaming;

  beforeEach(() => {
    handler = new Eurostreaming(fetcher);
  });

  test('handles non-existent series gracefully', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt12345678', 1, 1));
    expect(streams).toHaveLength(0);
  });

  test('handle imdb black mirror s2e4', async () => {
    const streams = await handler.handle(ctx, 'series', new ImdbId('tt2085059', 2, 4));
    expect(streams).toMatchSnapshot();
  });
});
