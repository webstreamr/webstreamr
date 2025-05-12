import TTLCache from '@isaacs/ttlcache';
import { EmbedExtractor } from './types';
import { Context, UrlResult } from '../types';

export class EmbedExtractors {
  private readonly embedExtractors: EmbedExtractor[];

  private readonly urlResultCache: TTLCache<string, UrlResult>;

  constructor(embedExtractors: EmbedExtractor[]) {
    this.embedExtractors = embedExtractors;
    this.urlResultCache = new TTLCache({ max: 1024 });
  }

  readonly handle = async (ctx: Context, url: URL, countryCode: string): Promise<UrlResult> => {
    let urlResult = this.urlResultCache.get(url.href);
    if (urlResult) {
      return urlResult;
    }

    const embedExtractor = this.embedExtractors.find(embedExtractor => embedExtractor.supports(url));
    if (undefined === embedExtractor) {
      throw new Error(`No embed extractor found that supports url ${url}`);
    }

    urlResult = await embedExtractor.extract(ctx, url, countryCode);
    this.urlResultCache.set(url.href, urlResult, { ttl: embedExtractor.ttl });

    return urlResult;
  };
}
