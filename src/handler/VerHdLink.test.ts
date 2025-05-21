import winston from 'winston';
import { VerHdLink } from './VerHdLink';
import { Fetcher } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const handler = new VerHdLink(fetcher, new ExtractorRegistry(logger, fetcher));
const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { es: 'on', mx: 'on' } };

describe('VerHdLink', () => {
  test('does not handle non imdb movies', async () => {
    const streams = await handler.handle(ctx, 'movie', 'kitsu:123');
    expect(streams).toHaveLength(0);
  });

  test('handles non-existent movies gracefully', async () => {
    const streams = await handler.handle(ctx, 'movie', 'tt12345678');
    expect(streams).toHaveLength(0);
  });

  test('handle titanic', async () => {
    const streams = (await handler.handle(ctx, 'movie', 'tt0120338')).filter(stream => stream !== undefined);
    expect(streams).toMatchSnapshot();
  });
});
