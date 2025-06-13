import winston from 'winston';
import { FetcherMock } from '../utils';
import { Context, CountryCode } from '../types';
import { ExtractorRegistry } from './ExtractorRegistry';
import { KinoGer } from './KinoGer';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new KinoGer(new FetcherMock(`${__dirname}/__fixtures__/KinoGer`))]);

const ctx: Context = { id: 'id', ip: '127.0.0.1', config: {} };

describe('KinoGer', () => {
  test('Blood & Sinners', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://kinoger.re/#ge5fhb'), CountryCode.de)).toMatchSnapshot();
  });

  test('Dead City', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://kinoger.re/#x6tsx9'), CountryCode.de)).toMatchSnapshot();
  });
});
