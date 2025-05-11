import TTLCache from '@isaacs/ttlcache';
import { EmbedExtractor } from './types';
import { Context, UrlResult } from '../types';

export class EmbedExtractors {
  private readonly embedExtractors: EmbedExtractor[];

  private readonly cache: TTLCache<string, UrlResult>;

  constructor(embedExtractors: EmbedExtractor[]) {
    this.embedExtractors = embedExtractors;
    this.cache = new TTLCache({ max: 1024, ttl: 900000 }); // 15m
  }

  readonly handle = async (ctx: Context, url: URL, language: string): Promise<UrlResult> => {
    let urlResult = this.cache.get(url.href);
    if (urlResult) {
      return urlResult;
    }

    const embedExtractor = this.embedExtractors.find(embedExtractor => embedExtractor.supports(url));
    if (undefined === embedExtractor) {
      throw new Error(`No embed extractor found that supports url ${url}`);
    }

    urlResult = await embedExtractor.extract(ctx, url, language);
    this.cache.set(url.href, urlResult);

    return urlResult;
  };
}
