// eslint-disable-next-line import/no-named-as-default
import KeyvSqlite from '@keyv/sqlite';
import { Cacheable, CacheableMemory, Keyv } from 'cacheable';
import winston from 'winston';
import { Context, Meta, UrlResult } from '../types';
import { getCacheDir, isExtractorDisabled } from '../utils';
import { Extractor } from './Extractor';

export class ExtractorRegistry {
  private readonly logger: winston.Logger;
  private readonly extractors: Extractor[];

  private readonly metaCache: Cacheable;
  private readonly urlResultCache: Cacheable;

  public constructor(logger: winston.Logger, extractors: Extractor[]) {
    this.logger = logger;
    this.extractors = extractors;

    this.metaCache = new Cacheable({
      nonBlocking: true,
      primary: new Keyv({ store: new CacheableMemory({ lruSize: 16384 }) }),
      secondary: new Keyv(new KeyvSqlite(`sqlite://${getCacheDir()}/webstreamr-meta-cache.sqlite`)),
    });
    this.urlResultCache = new Cacheable({
      nonBlocking: true,
      primary: new Keyv({ store: new CacheableMemory({ lruSize: 1024 }) }),
      secondary: new Keyv(new KeyvSqlite(`sqlite://${getCacheDir()}/webstreamr-extractor-cache.sqlite`)),
      stats: true,
    });
  }

  public stats() {
    return {
      urlResultCache: this.urlResultCache.stats,
    };
  };

  public async handle(ctx: Context, url: URL, meta?: Meta): Promise<UrlResult[]> {
    const extractor = this.extractors.find(extractor => !isExtractorDisabled(ctx.config, extractor) && extractor.supports(ctx, url));
    if (!extractor) {
      return [];
    }

    const normalizedUrl = extractor.normalize(url);
    const cacheKey = extractor.viaMediaFlowProxy
      ? `${extractor.id}_${normalizedUrl}_${ctx.config.mediaFlowProxyUrl}`
      : `${extractor.id}_${normalizedUrl}`;

    const storedDataRaw = await this.urlResultCache.getRaw<UrlResult[]>(cacheKey);
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

    this.logger.info(`Extract ${url} using ${extractor.id} extractor`, ctx);

    const cachedMeta = await this.metaCache.get<Meta>(cacheKey);

    const urlResults = await extractor.extract(
      ctx,
      normalizedUrl,
      {
        ...meta,
        ...cachedMeta,
        extractorId: meta?.extractorId ?? extractor.id,
      },
    );

    if (!urlResults.length) {
      await this.urlResultCache.set<UrlResult[]>(cacheKey, urlResults, 43200000); // 12h
    } else if (!urlResults.some(urlResult => urlResult.error) && extractor.ttl) {
      await this.urlResultCache.set<UrlResult[]>(cacheKey, urlResults, extractor.ttl);
    }

    if (urlResults.length) {
      await this.metaCache.set<Meta>(cacheKey, urlResults[0]?.meta as Meta, 2628000); // 1 month
    }

    return urlResults;
  };

  private randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
