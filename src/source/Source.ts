// eslint-disable-next-line import/no-named-as-default
import KeyvSqlite from '@keyv/sqlite';
import { Cacheable, CacheableMemory, Keyv } from 'cacheable';
import { ContentType } from 'stremio-addon-sdk';
import { NotFoundError } from '../error';
import { Context, CountryCode, Meta } from '../types';
import { getCacheDir, Id } from '../utils';

export interface SourceResult {
  url: URL;
  meta: Meta;
}

export abstract class Source {
  public abstract readonly id: string;

  public abstract readonly label: string;

  public readonly ttl: number = 43200000; // 12h

  public abstract readonly contentTypes: ContentType[];

  public abstract readonly countryCodes: CountryCode[];

  public abstract readonly baseUrl: string;

  private static readonly sourceResultCache = new Cacheable({
    primary: new Keyv({ store: new CacheableMemory({ lruSize: 1024 }) }),
    secondary: new Keyv(new KeyvSqlite(`sqlite://${getCacheDir()}/webstreamr-source-cache-v2.sqlite`)),
    stats: true,
  });

  protected abstract handleInternal(ctx: Context, type: ContentType, id: Id): Promise<(SourceResult[])>;

  public static stats() {
    return {
      sourceResultCache: Source.sourceResultCache.stats,
    };
  };

  public async handle(ctx: Context, type: ContentType, id: Id): Promise<(SourceResult[])> {
    const cacheKey = `${this.id}_${id.toString()}`;

    let sourceResults = (await Source.sourceResultCache.get<SourceResult[]>(cacheKey))
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

      await Source.sourceResultCache.set<SourceResult[]>(cacheKey, sourceResults, this.ttl);
    }

    return sourceResults.filter(sourceResult => sourceResult.meta.countryCodes?.some(countryCode => countryCode in ctx.config));
  }
}
