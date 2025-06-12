import winston from 'winston';
import { Fetcher } from '../utils';
import { Context, CountryCode } from '../types';
import { ExtractorRegistry } from './ExtractorRegistry';
import { Soaper } from './Soaper';

jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const extractorRegistry = new ExtractorRegistry(logger, [new Soaper(fetcher)]);

const ctx: Context = { id: 'id', ip: '127.0.0.1', config: {} };

describe('Soaper', () => {
  test('Full Metal Jacket', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://soaper.live/movie_d8kdeypDY9.html'), CountryCode.en, 'Full Metal Jacket (1987)')).toMatchSnapshot();
  });

  test('Black Mirror', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://soaper.live/episode_5KDq78eGp1.html'), CountryCode.en, 'Black Mirror 4x2')).toMatchSnapshot();
  });
});
