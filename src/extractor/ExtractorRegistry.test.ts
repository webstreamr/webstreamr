import winston from 'winston';
import { ExtractorRegistry } from './ExtractorRegistry';
import { Context, CountryCode } from '../types';
import { Fetcher } from '../utils';
import { createExtractors } from './index';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const extractorRegistry = new ExtractorRegistry(logger, createExtractors(fetcher));

describe('ExtractorRegistry', () => {
  const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { de: 'on' } };

  test('returns error result from extractor', async () => {
    const urlResult = await extractorRegistry.handle(ctx, new URL('https://some-url.test'), CountryCode.de);

    expect(urlResult).toMatchSnapshot();
  });

  test('return external URLs by default', async () => {
    const urlResult = await extractorRegistry.handle(ctx, new URL('https://mixdrop.ag/e/3nzwveprim63or6'), CountryCode.de);

    expect(urlResult).toMatchSnapshot();
  });

  test('does not return external URLs if disabled by config', async () => {
    const urlResult = await extractorRegistry.handle({ ...ctx, config: { ...ctx.config, excludeExternalUrls: 'on' } }, new URL('https://mixdrop.ag/e/l7v73zqrfdj19z'), CountryCode.de);

    expect(urlResult).toStrictEqual([]);
  });

  test('returns from memory cache if possible', async () => {
    const urlResults1 = await extractorRegistry.handle(ctx, new URL('https://dropload.io/lyo2h1snpe5c.html'), CountryCode.de);
    const urlResults2 = await extractorRegistry.handle(ctx, new URL('https://dropload.io/lyo2h1snpe5c.html'), CountryCode.de);

    expect(urlResults1).not.toStrictEqual([]);
    expect(urlResults2).not.toStrictEqual([]);
  });

  test('ignores not found errors but caches them', async () => {
    const urlResults1 = await extractorRegistry.handle(ctx, new URL('https://dropload.io/asdfghijklmn.html'), CountryCode.de);
    const urlResults2 = await extractorRegistry.handle(ctx, new URL('https://dropload.io/asdfghijklmn.html'), CountryCode.de);

    expect(urlResults1).toStrictEqual([]);
    expect(urlResults2).toStrictEqual([]);
  });

  test('returns external url for error', async () => {
    const urlResults = await extractorRegistry.handle(ctx, new URL('https://dropload.io/mocked-blocked.html'), CountryCode.de);
    expect(urlResults).toMatchSnapshot();
  });

  test('returns external url for error with title', async () => {
    const urlResults = await extractorRegistry.handle(ctx, new URL('https://dropload.io/mocked-blocked-2.html'), CountryCode.de, 'a title!');
    expect(urlResults).toMatchSnapshot();
  });
});
