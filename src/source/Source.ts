// eslint-disable-next-line import/no-named-as-default
import KeyvSqlite from '@keyv/sqlite';
import { Cacheable, CacheableMemory, Keyv } from 'cacheable';
import { ContentType } from 'stremio-addon-sdk';
import { NotFoundError } from '../error';
import { Context, CountryCode, Meta } from '../types';
import { getCacheDir, Id, scheduleKeyvSqliteCleanup } from '../utils';

export interface SourceResult {
  url: URL;
  meta: Meta;
}

const sourceResultKeyvSqlite = new KeyvSqlite(`sqlite://${getCacheDir()}/webstreamr-source-cache-v2.sqlite`);
const sourceResultCache = new Cacheable({
  nonBlocking: true,
  primary: new Keyv({ store: new CacheableMemory({ lruSize: 1024 }) }),
  secondary: new Keyv(sourceResultKeyvSqlite),
  stats: true,
});
scheduleKeyvSqliteCleanup(sourceResultKeyvSqlite);

export abstract class Source {
  public abstract readonly id: string;

  public abstract readonly label: string;

  public readonly ttl: number = 43200000; // 12h

  public readonly useOnlyWithMaxUrlsFound: number | undefined = undefined; // fallback sources are only considered if we don't have enough URLs from others already

  public abstract readonly contentTypes: ContentType[];

  public abstract readonly countryCodes: CountryCode[];

  public abstract readonly baseUrl: string;

  protected abstract handleInternal(ctx: Context, type: ContentType, id: Id): Promise<(SourceResult[])>;

  public static stats() {
    return {
      sourceResultCache: sourceResultCache.stats,
    };
  };

  public async handle(ctx: Context, type: ContentType, id: Id): Promise<(SourceResult[])> {
    const cacheKey = `${this.id}_${id.toString()}`;

    let sourceResults = (await sourceResultCache.get<SourceResult[]>(cacheKey))
      ?.map(sourceResult => ({ ...sourceResult, url: new URL(sourceResult.url) }));

    if (!sourceResults) {
      try {
        sourceResults = await this.handleInternal(ctx, type, id);
      } catch (error) {
        if (error instanceof NotFoundError) {
          sourceResults = [];
        } else {
          throw error;
        }
      }

      await sourceResultCache.set<SourceResult[]>(cacheKey, sourceResults, this.ttl);
    }

    if (this.countryCodes.includes(CountryCode.multi)) {
      return sourceResults;
    }

    return sourceResults.filter(sourceResult => sourceResult.meta.countryCodes?.some(countryCode => countryCode in ctx.config));
  }
}
