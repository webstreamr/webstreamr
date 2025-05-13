import { EmbedExtractorRegistry } from './EmbedExtractorRegistry';
import { Context } from '../types';
import { Fetcher } from '../utils';
jest.mock('../utils/Fetcher');

// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const embedExtractors = new EmbedExtractorRegistry(fetcher);

describe('EmbedExtractorRegistry', () => {
  const ctx: Context = { ip: '127.0.0.1' };

  test('returns undefined when no embed extractor can be found', async () => {
    const urlResult = await embedExtractors.handle(ctx, new URL('https://some-url.test'), 'en');

    expect(urlResult).toBeUndefined();
  });

  test('returns from memory cache if possible', async () => {
    const urlResult1 = await embedExtractors.handle(ctx, new URL('https://dropload.io/lyo2h1snpe5c.html'), 'de');
    const urlResult2 = await embedExtractors.handle(ctx, new URL('https://dropload.io/lyo2h1snpe5c.html'), 'de');

    expect(urlResult2).toBe(urlResult1);
  });
});
