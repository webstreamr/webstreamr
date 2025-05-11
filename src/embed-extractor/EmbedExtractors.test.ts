import { EmbedExtractors } from './EmbedExtractors';

describe('EmbedExtractors', () => {
  test('throws when no embed extractor can be found', () => {
    const embedExtractors = new EmbedExtractors([]);

    expect(embedExtractors.handle(new URL('https://some-url.test'), 'en')).rejects.toThrow('No embed extractor found that supports url https://some-url.test');
  });
});
