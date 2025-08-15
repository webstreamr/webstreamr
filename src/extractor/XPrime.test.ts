import winston from 'winston';
import { createTestContext } from '../test';
import { CountryCode } from '../types';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { XPrime } from './XPrime';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new XPrime(new FetcherMock(`${__dirname}/__fixtures__/XPrime`))]);

const ctx = createTestContext();

describe('XPrime', () => {
  test('unknown backend is ignored', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://backend.xprime.tv/unknown?name=Superman&year=2025'), CountryCode.en, 'Superman (2025)')).toMatchSnapshot();
  });

  test('primebox Superman', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://backend.xprime.tv/primebox?name=Superman&year=2025'), CountryCode.en, 'Superman (2025)')).toMatchSnapshot();
  });

  test('primebox Alien: Earth', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://backend.xprime.tv/primebox?name=Alien%3A%20Earth&year=2025&season=1&episode=1'), CountryCode.en, 'Alien: Earth 1x1')).toMatchSnapshot();
  });

  test('primebox not found', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://backend.xprime.tv/primebox?name=Jurassic%20World%20Rebirth&year=2025'), CountryCode.en, 'Jurassic World Rebirth (2025)')).toMatchSnapshot();
  });
});
