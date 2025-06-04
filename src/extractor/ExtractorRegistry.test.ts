import winston from 'winston';
import { ExtractorRegistry } from './ExtractorRegistry';
import { Context, UrlResult } from '../types';
import { Fetcher } from '../utils';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const extractorRegistry = new ExtractorRegistry(logger, fetcher);

describe('ExtractorRegistry', () => {
  const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { de: 'on' } };

  test('returns error result from extractor', async () => {
    const urlResult = await extractorRegistry.handle(ctx, new URL('https://some-url.test'), { countryCode: 'en' });

    expect(urlResult).toMatchSnapshot();
  });

  test('return external URLs by default', async () => {
    const urlResult = await extractorRegistry.handle(ctx, new URL('https://mixdrop.ag/e/3nzwveprim63or6'), { countryCode: 'de' });

    expect(urlResult).toMatchSnapshot();
  });

  test('does not return external URLs if disabled by config', async () => {
    const urlResult = await extractorRegistry.handle({ ...ctx, config: { ...ctx.config, excludeExternalUrls: 'on' } }, new URL('https://mixdrop.ag/e/l7v73zqrfdj19z'), { countryCode: 'de' });

    expect(urlResult).toBeUndefined();
  });

  test('returns from memory cache if possible', async () => {
    const { ttl: ttl1, ...urlResultRest1 } = await extractorRegistry.handle(ctx, new URL('https://dropload.io/lyo2h1snpe5c.html'), { countryCode: 'de' }) as UrlResult;
    const { ttl: ttl2, ...urlResultRest2 } = await extractorRegistry.handle(ctx, new URL('https://dropload.io/lyo2h1snpe5c.html'), { countryCode: 'de' }) as UrlResult;

    expect(urlResultRest1).not.toBeUndefined();
    expect(urlResultRest2).toStrictEqual(urlResultRest1);

    expect(ttl1).not.toBe(undefined);
    expect(ttl2).not.toBe(undefined);
  });

  test('ignores not found errors but caches them', async () => {
    const urlResult1 = await extractorRegistry.handle(ctx, new URL('https://dropload.io/asdfghijklmn.html'), { countryCode: 'de' });
    const urlResult2 = await extractorRegistry.handle(ctx, new URL('https://dropload.io/asdfghijklmn.html'), { countryCode: 'de' });

    expect(urlResult1).toBeUndefined();
    expect(urlResult2).toBeUndefined();
  });
});
