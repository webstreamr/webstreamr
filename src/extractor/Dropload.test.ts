import winston from 'winston';
import { FetcherMock } from '../utils';
import { Context, CountryCode } from '../types';
import { ExtractorRegistry } from './ExtractorRegistry';
import { Dropload } from './Dropload';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new Dropload(new FetcherMock(`${__dirname}/__fixtures__/Dropload`))]);

const ctx: Context = { id: 'id', ip: '127.0.0.1', config: {} };

describe('Dropload', () => {
  test('dropload.io', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://dropload.io/embed-lyo2h1snpe5c.html'), CountryCode.de)).toMatchSnapshot();
  });

  test('file not found', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://dropload.io/asdfghijklmn.html'), CountryCode.de)).toMatchSnapshot();
  });
});
