// eslint-disable-next-line import/no-named-as-default
import KeyvSqlite from '@keyv/sqlite';
import { Cacheable, CacheableMemory, Keyv } from 'cacheable';
import winston from 'winston';
import { Context, Format, Meta, UrlResult } from '../types';
import { envGet, getCacheDir, isExtractorDisabled, scheduleKeyvSqliteCleanup } from '../utils';
import { Extractor } from './Extractor';

export class ExtractorRegistry {
  private readonly logger: winston.Logger;
  private readonly extractors: Extractor[];

  private readonly urlResultCache: Cacheable;
  private readonly lazyUrlResultCache: Cacheable;

  public constructor(logger: winston.Logger, extractors: Extractor[]) {
    this.logger = logger;
    this.extractors = extractors;

    const urlResultKeyvSqlite = new KeyvSqlite(`sqlite://${getCacheDir()}/webstreamr-extractor-cache.sqlite`);
    this.urlResultCache = new Cacheable({
      nonBlocking: true,
      primary: new Keyv({ store: new CacheableMemory({ lruSize: 1024 }) }),
      secondary: new Keyv(urlResultKeyvSqlite),
      stats: true,
    });
    scheduleKeyvSqliteCleanup(urlResultKeyvSqlite);

    const lazyUrlResultKeyvSqlite = new KeyvSqlite(`sqlite://${getCacheDir()}/webstreamr-extractor-lazy-cache.sqlite`);
    this.lazyUrlResultCache = new Cacheable({
      nonBlocking: true,
      primary: new Keyv({ store: new CacheableMemory({ lruSize: 1024 }) }),
      secondary: new Keyv(lazyUrlResultKeyvSqlite),
      stats: true,
    });
    scheduleKeyvSqliteCleanup(lazyUrlResultKeyvSqlite);
  }

  public stats() {
    return {
      urlResultCache: this.urlResultCache.stats,
      lazyUrlResultCache: this.lazyUrlResultCache.stats,
    };
  };

  public async handle(ctx: Context, url: URL, meta?: Meta, allowLazy?: boolean): Promise<UrlResult[]> {
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
      const ttl = expires - Date.now();

      /* istanbul ignore if */
      if (ttl > 0) {
        return (storedDataRaw.value as UrlResult[]).map(urlResult => ({ ...urlResult, ttl, url: new URL(urlResult.url) }));
      }
    }

    const lazyUrlResults = await this.lazyUrlResultCache.get<UrlResult[]>(normalizedUrl.href) ?? [];

    /* istanbul ignore next */
    if (
      lazyUrlResults.length && allowLazy && !extractor.viaMediaFlowProxy
      && lazyUrlResults.every(urlResult => urlResult.format !== Format.hls) // related to Android issues, e.g. https://github.com/Stremio/stremio-bugs/issues/1574 or https://github.com/Stremio/stremio-bugs/issues/1579
    ) {
      // generate lazy extract urls
      return lazyUrlResults.map((urlResult, index) => {
        const extractUrl = new URL(`${envGet('PROTOCOL')}:${envGet('HOST')}/extract/`);

        extractUrl.searchParams.set('index', `${index}`);
        extractUrl.searchParams.set('url', url.href);

        return { ...urlResult, url: extractUrl };
      });
    }

    this.logger.info(`Extract ${url} using ${extractor.id} extractor`, ctx);

    const urlResults = await extractor.extract(
      ctx,
      normalizedUrl,
      {
        ...meta,
        ...(/* istanbul ignore next */lazyUrlResults[0]?.meta?.bytes && { bytes: lazyUrlResults[0]?.meta?.bytes }),
        ...(/* istanbul ignore next */lazyUrlResults[0]?.meta?.height && { height: lazyUrlResults[0]?.meta?.height }),
        extractorId: meta?.extractorId ?? extractor.id,
      },
    );

    if (!urlResults.length) {
      await this.urlResultCache.set<UrlResult[]>(cacheKey, urlResults, 43200000); // 12h
    } else if (!urlResults.some(urlResult => urlResult.error)) {
      /* istanbul ignore else */
      if (extractor.ttl) {
        await this.urlResultCache.set<UrlResult[]>(cacheKey, urlResults, extractor.ttl);
      }
      if (extractor.id !== 'external') {
        await this.lazyUrlResultCache.set<UrlResult[]>(normalizedUrl.href, urlResults, 2629800000); // 1 month
      }
    } else {
      await this.lazyUrlResultCache.delete(normalizedUrl.href);
    }

    return urlResults;
  };
}
