import winston from 'winston';
import { ExtractorRegistry } from './ExtractorRegistry';
import { Context } from '../types';
import { Fetcher } from '../utils';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const extractorRegistry = new ExtractorRegistry(logger, fetcher);

describe('ExtractorRegistry', () => {
  const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { de: 'on' } };

  test('returns undefined when no extractor can be found', async () => {
    const urlResult = await extractorRegistry.handle(ctx, new URL('https://some-url.test'), { countryCode: 'en' });

    expect(urlResult).toBeUndefined();
  });

  test('returns from memory cache if possible', async () => {
    const urlResult1 = await extractorRegistry.handle(ctx, new URL('https://dropload.io/lyo2h1snpe5c.html'), { countryCode: 'de' });
    const urlResult2 = await extractorRegistry.handle(ctx, new URL('https://dropload.io/lyo2h1snpe5c.html'), { countryCode: 'de' });

    expect(urlResult2).toBe(urlResult1);
  });

  test('returns from memory cache if possible', async () => {
    const urlResult1 = await extractorRegistry.handle(ctx, new URL('https://dropload.io/lyo2h1snpe5c.html'), { countryCode: 'de' });
    const urlResult2 = await extractorRegistry.handle(ctx, new URL('https://dropload.io/lyo2h1snpe5c.html'), { countryCode: 'de' });

    expect(urlResult2).toBe(urlResult1);
  });

  test('ignores not found errors', async () => {
    const urlResult = await extractorRegistry.handle(ctx, new URL('https://dropload.io/asdfghijklmn.html'), { countryCode: 'de' });

    expect(urlResult).toBeUndefined();
  });
});
