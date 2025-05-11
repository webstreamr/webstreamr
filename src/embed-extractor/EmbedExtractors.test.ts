import { EmbedExtractors } from './EmbedExtractors';
import { Context } from '../types';
import { Fetcher } from '../utils';
import { Dropload } from './Dropload';
jest.mock('../utils/Fetcher');

describe('EmbedExtractors', () => {
  const ctx: Context = { ip: '127.0.0.1' };

  test('throws when no embed extractor can be found', () => {
    const embedExtractors = new EmbedExtractors([]);

    expect(embedExtractors.handle(ctx, new URL('https://some-url.test'), 'en'))
      .rejects.toThrow('No embed extractor found that supports url https://some-url.test');
  });

  test('returns from memory cache if possible', async () => {
    // @ts-expect-error No constructor args needed
    const fetcher = new Fetcher();
    const embedExtractors = new EmbedExtractors([new Dropload(fetcher)]);

    const urlResult1 = await embedExtractors.handle(ctx, new URL('https://dropload.io/lyo2h1snpe5c.html'), 'de');
    const urlResult2 = await embedExtractors.handle(ctx, new URL('https://dropload.io/lyo2h1snpe5c.html'), 'de');

    expect(urlResult2).toBe(urlResult1);
  });
});
