import winston from 'winston';
import { VerHdLink } from './VerHdLink';
import { Fetcher, ImdbId } from '../utils';
import { Context } from '../types';

jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const fetcher = new Fetcher(logger);
const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { es: 'on', mx: 'on' } };

describe('VerHdLink', () => {
  let handler: VerHdLink;

  beforeEach(() => {
    handler = new VerHdLink(fetcher);
  });

  test('handles non-existent movies gracefully', async () => {
    const streams = await handler.handle(ctx, 'movie', new ImdbId('tt12345678', undefined, undefined));
    expect(streams).toHaveLength(0);
  });

  test('handle titanic', async () => {
    const streams = await handler.handle(ctx, 'movie', new ImdbId('tt0120338', undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
