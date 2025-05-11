import { EmbedExtractors } from './EmbedExtractors';
import { Context } from '../types';

describe('EmbedExtractors', () => {
  const ctx: Context = { ip: '127.0.0.1' };

  test('throws when no embed extractor can be found', () => {
    const embedExtractors = new EmbedExtractors([]);

    expect(embedExtractors.handle(ctx, new URL('https://some-url.test'), 'en'))
      .rejects.toThrow('No embed extractor found that supports url https://some-url.test');
  });
});
