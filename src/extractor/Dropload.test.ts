import winston from 'winston';
import { FetcherMock } from '../utils';
import { CountryCode } from '../types';
import { ExtractorRegistry } from './ExtractorRegistry';
import { Dropload } from './Dropload';
import { createTestContext } from '../test';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new Dropload(new FetcherMock(`${__dirname}/__fixtures__/Dropload`))]);

const ctx = createTestContext();

describe('Dropload', () => {
  test('dropload.io', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://dropload.io/embed-lyo2h1snpe5c.html'), CountryCode.de)).toMatchSnapshot();
  });

  test('file not found', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://dropload.io/asdfghijklmn.html'), CountryCode.de)).toMatchSnapshot();
  });
});
