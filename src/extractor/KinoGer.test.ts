import winston from 'winston';
import { Fetcher } from '../utils';
import { Context, CountryCode } from '../types';
import { ExtractorRegistry } from './ExtractorRegistry';
import { KinoGer } from './KinoGer';

jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const fetcher = new Fetcher(logger);
const extractorRegistry = new ExtractorRegistry(logger, [new KinoGer(fetcher)]);

const ctx: Context = { id: 'id', ip: '127.0.0.1', config: {} };

describe('KinoGer', () => {
  test('Blood & Sinners', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://kinoger.re/#ge5fhb'), CountryCode.de)).toMatchSnapshot();
  });

  test('Dead City', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://kinoger.re/#x6tsx9'), CountryCode.de)).toMatchSnapshot();
  });
});
