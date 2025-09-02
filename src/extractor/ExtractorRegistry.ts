import { Cacheable, CacheableMemory, Keyv } from 'cacheable';
import winston from 'winston';
import { Context, CountryCode, UrlResult } from '../types';
import { isExtractorDisabled } from '../utils';
import { Extractor } from './Extractor';

export class ExtractorRegistry {
  private readonly logger: winston.Logger;
  private readonly extractors: Extractor[];
  private readonly urlResultCache: Cacheable;

  public constructor(logger: winston.Logger, extractors: Extractor[]) {
    this.logger = logger;
    this.extractors = extractors;

    this.urlResultCache = new Cacheable({ primary: new Keyv({ store: new CacheableMemory({ lruSize: 4096 }) }) });
  }

  public async handle(ctx: Context, url: URL, countryCode: CountryCode, title?: string | undefined): Promise<UrlResult[]> {
    const extractor = this.extractors.find(extractor => !isExtractorDisabled(ctx.config, extractor) && extractor.supports(ctx, url));
    if (!extractor) {
      return [];
    }

    const normalizedUrl = extractor.normalize(url);
    const cacheKey = extractor.viaMediaFlowProxy
      ? `${extractor.id}_${normalizedUrl}_${ctx.config.mediaFlowProxyUrl}`
      : `${extractor.id}_${normalizedUrl}`;

    const storedDataRaw = await this.urlResultCache.get<UrlResult[]>(cacheKey, { raw: true });
    if (storedDataRaw) {
      return (storedDataRaw.value as UrlResult[]).map(urlResult => ({ ...urlResult, ttl: storedDataRaw.expires as number - Date.now(), url: new URL(urlResult.url) }));
    }

    this.logger.info(`Extract stream URL using ${extractor.id} extractor from ${url}`, ctx);

    const urlResults = await extractor.extract(ctx, normalizedUrl, countryCode, title);

    if (!urlResults.some(urlResult => urlResult.error) && extractor.ttl) {
      await this.urlResultCache.set<UrlResult[]>(cacheKey, urlResults, extractor.ttl);
    }

    return urlResults;
  };
}
