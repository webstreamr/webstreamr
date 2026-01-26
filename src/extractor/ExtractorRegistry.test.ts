import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { createExtractors } from './index';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, createExtractors(new FetcherMock(`${__dirname}/__fixtures__/ExtractorRegistry`)));

describe('ExtractorRegistry', () => {
  const ctx = createTestContext();

  test('returns error result from extractor', async () => {
    const urlResult = await extractorRegistry.handle(ctx, new URL('https://some-url.test'));

    expect(urlResult).toMatchSnapshot();
  });

  test('returns external URLs if enabled by config', async () => {
    const urlResult = await extractorRegistry.handle({ ...ctx, config: { ...ctx.config, includeExternalUrls: 'on' } }, new URL('https://mixdrop.ag/e/3nzwveprim63or6'));

    expect(urlResult).toMatchSnapshot();
  });

  test('does not return external URLs by default', async () => {
    const urlResult = await extractorRegistry.handle(ctx, new URL('https://mixdrop.ag/e/l7v73zqrfdj19z'));

    expect(urlResult).toStrictEqual([]);
  });

  test('returns from memory cache if possible', async () => {
    const urlResults1 = await extractorRegistry.handle(ctx, new URL('https://dropload.io/lyo2h1snpe5c.html'));
    const urlResults2 = await extractorRegistry.handle(ctx, new URL('https://dropload.io/lyo2h1snpe5c.html'));

    expect(urlResults1).not.toStrictEqual([]);
    expect(urlResults2).not.toStrictEqual([]);
  });

  test('ignores not found errors but caches them', async () => {
    const urlResults1 = await extractorRegistry.handle(ctx, new URL('https://dropload.io/asdfghijklmn.html'));
    const urlResults2 = await extractorRegistry.handle(ctx, new URL('https://dropload.io/asdfghijklmn.html'));

    expect(urlResults1).toStrictEqual([]);
    expect(urlResults2).toStrictEqual([]);
  });

  test('returns external url for error', async () => {
    const urlResults = await extractorRegistry.handle(ctx, new URL('https://dropload.io/mocked-blocked.html'));
    expect(urlResults).toMatchSnapshot();
  });

  test('empty results are cached', async () => {
    const urlResults = await extractorRegistry.handle(ctx, new URL('https://dropload.io/asdfghijklmn.html'), { title: 'title' });
    expect(urlResults).toMatchSnapshot();
  });

  test('stats returns something', async () => {
    const stats = extractorRegistry.stats();

    expect(stats).toHaveProperty('urlResultCache');
    expect(stats.urlResultCache).toBeTruthy();
  });
});
