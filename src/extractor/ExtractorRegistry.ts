import TTLCache from '@isaacs/ttlcache';
import winston from 'winston';
import { Context, CountryCode, UrlResult } from '../types';
import { isExtractorDisabled } from '../utils';
import { Extractor } from './Extractor';

export class ExtractorRegistry {
  private readonly logger: winston.Logger;
  private readonly extractors: Extractor[];
  private readonly urlResultCache: TTLCache<string, UrlResult[]>;

  public constructor(logger: winston.Logger, extractors: Extractor[]) {
    this.logger = logger;
    this.extractors = extractors;
    this.urlResultCache = new TTLCache({ max: 4096 });
  }

  public async handle(ctx: Context, url: URL, countryCode: CountryCode, title?: string | undefined): Promise<UrlResult[]> {
    const extractor = this.extractors.find(extractor => !isExtractorDisabled(ctx.config, extractor) && extractor.supports(ctx, url));
    if (!extractor) {
      return [];
    }

    const normalizedUrl = extractor.normalize(url);
    const cacheKey = `${extractor.id}_${normalizedUrl}`;

    let urlResults = this.urlResultCache.get(cacheKey) ?? [];
    if (this.urlResultCache.has(cacheKey)) {
      return urlResults.map(urlResult => ({ ...urlResult, ttl: this.urlResultCache.getRemainingTTL(cacheKey) }));
    }

    this.logger.info(`Extract stream URL using ${extractor.id} extractor from ${url}`, ctx);

    urlResults = await extractor.extract(ctx, normalizedUrl, countryCode, title);

    if (!urlResults.some(urlResult => urlResult.error) && extractor.ttl) {
      this.urlResultCache.set(cacheKey, urlResults, { ttl: extractor.ttl });
    }

    return urlResults;
  };
}
