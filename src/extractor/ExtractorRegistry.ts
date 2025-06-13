import TTLCache from '@isaacs/ttlcache';
import winston from 'winston';
import { Extractor } from './Extractor';
import { Context, CountryCode, UrlResult } from '../types';

export class ExtractorRegistry {
  private readonly logger: winston.Logger;
  private readonly extractors: Extractor[];
  private readonly urlResultCache: TTLCache<string, UrlResult[]>;

  public constructor(logger: winston.Logger, extractors: Extractor[]) {
    this.logger = logger;
    this.extractors = extractors;
    this.urlResultCache = new TTLCache({ max: 1024 });
  }

  public async handle(ctx: Context, url: URL, countryCode: CountryCode, title?: string | undefined): Promise<UrlResult[]> {
    const extractor = this.extractors.find(extractor => extractor.supports(ctx, url));
    if (!extractor) {
      return [];
    }

    const normalizedUrl = extractor.normalize(url);

    let urlResults = this.urlResultCache.get(normalizedUrl.href) ?? [];
    if (this.urlResultCache.has(normalizedUrl.href)) {
      return urlResults.map(urlResult => ({ ...urlResult, ttl: this.urlResultCache.getRemainingTTL(normalizedUrl.href) }));
    }

    this.logger.info(`Extract stream URL using ${extractor.id} extractor from ${url}`, ctx);

    urlResults = await extractor.extract(ctx, normalizedUrl, countryCode, title);
    this.urlResultCache.set(normalizedUrl.href, urlResults, { ttl: extractor.ttl });

    return urlResults;
  };
}
