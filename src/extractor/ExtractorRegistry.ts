// eslint-disable-next-line import/no-named-as-default
import KeyvSqlite from '@keyv/sqlite';
import { Cacheable, CacheableMemory, Keyv } from 'cacheable';
import winston from 'winston';
import { Context, CountryCode, UrlResult } from '../types';
import { getCacheDir, isExtractorDisabled } from '../utils';
import { Extractor } from './Extractor';

export class ExtractorRegistry {
  private readonly logger: winston.Logger;
  private readonly extractors: Extractor[];
  private readonly urlResultCache: Cacheable;

  public constructor(logger: winston.Logger, extractors: Extractor[]) {
    this.logger = logger;
    this.extractors = extractors;

    this.urlResultCache = new Cacheable({
      primary: new Keyv({ store: new CacheableMemory({ lruSize: 4096 }) }),
      secondary: new Keyv(new KeyvSqlite(`sqlite://${getCacheDir()}/webstreamr-extractor-cache.sqlite`)),
      stats: true,
    });
  }

  public stats() {
    return {
      urlResultCache: this.urlResultCache.stats,
    };
  };

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
    const expires = storedDataRaw?.expires;
    if (storedDataRaw && expires) {
      // Ignore the cache randomly after at least 2/3 of the TTL passed to start refreshing results slowly
      const refreshTimestamp = this.randomInteger(expires - extractor.ttl * (2 / 3), expires);
      const now = Date.now();

      /* istanbul ignore if */
      if (refreshTimestamp > now) {
        return (storedDataRaw.value as UrlResult[]).map(urlResult => ({ ...urlResult, ttl: expires - now, url: new URL(urlResult.url) }));
      }
    }

    this.logger.info(`Extract stream URL using ${extractor.id} extractor from ${url}`, ctx);

    const urlResults = await extractor.extract(ctx, normalizedUrl, countryCode, title);

    if (!urlResults.some(urlResult => urlResult.error) && extractor.ttl) {
      await this.urlResultCache.set<UrlResult[]>(cacheKey, urlResults, extractor.ttl);
    }

    return urlResults;
  };

  private randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
