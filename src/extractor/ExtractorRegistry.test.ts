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
  const ctx: Context = { ip: '127.0.0.1' };

  test('returns undefined when no extractor can be found', async () => {
    const urlResult = await extractorRegistry.handle(ctx, new URL('https://some-url.test'), 'en');

    expect(urlResult).toBeUndefined();
  });

  test('returns undefined when extractor fails', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://mixdrop.my/e/123456789'), 'en')).toBeUndefined();
  });

  test('returns from memory cache if possible', async () => {
    const urlResult1 = await extractorRegistry.handle(ctx, new URL('https://dropload.io/lyo2h1snpe5c.html'), 'de');
    const urlResult2 = await extractorRegistry.handle(ctx, new URL('https://dropload.io/lyo2h1snpe5c.html'), 'de');

    expect(urlResult2).toBe(urlResult1);
  });
});
