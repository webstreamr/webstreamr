import winston from 'winston';
import { Fetcher } from '../utils';
import { Context, CountryCode } from '../types';
import { ExtractorRegistry } from './ExtractorRegistry';
import { VidSrc } from './VidSrc';

jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const fetcher = new Fetcher(logger);
const extractorRegistry = new ExtractorRegistry(logger, [new VidSrc(fetcher)]);

const ctx: Context = { id: 'id', ip: '127.0.0.1', config: {} };

describe('VidSrc', () => {
  test('Full Metal Jacket', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://vidsrc.xyz/embed/movie/tt0093058'), CountryCode.en, 'Full Metal Jacket (1987)')).toMatchSnapshot();
  });

  test('Black Mirror', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://vidsrc.xyz/embed/tv/tt2085059/4/2'), CountryCode.en, 'Black Mirror 4x2')).toMatchSnapshot();
  });

  test('not found', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://vidsrc.xyz/embed/movie/tt35628853'), CountryCode.en, 'Black Mirror 4x2')).toMatchSnapshot();
  });
});
