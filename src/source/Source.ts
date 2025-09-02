import { Cacheable, CacheableMemory, Keyv } from 'cacheable';
import { ContentType } from 'stremio-addon-sdk';
import { NotFoundError } from '../error';
import { Context, CountryCode } from '../types';
import { Id } from '../utils';

export interface SourceResult {
  countryCode: CountryCode;
  title?: string;
  url: URL;
}

export abstract class Source {
  public abstract readonly id: string;

  public abstract readonly label: string;

  public readonly ttl: number = 10800000; // 3h

  public abstract readonly contentTypes: ContentType[];

  public abstract readonly countryCodes: CountryCode[];

  public abstract readonly baseUrl: string;

  private readonly sourceResultCache: Cacheable;

  public constructor() {
    this.sourceResultCache = new Cacheable({ primary: new Keyv({ store: new CacheableMemory({ lruSize: 1024, ttl: this.ttl }) }) });
  }

  protected abstract handleInternal(ctx: Context, type: ContentType, id: Id): Promise<(SourceResult[])>;

  public async handle(ctx: Context, type: ContentType, id: Id): Promise<(SourceResult[])> {
    const cacheKey = id.toString();

    let sourceResults = await this.sourceResultCache.get<SourceResult[]>(cacheKey);
    if (sourceResults) {
      return sourceResults.map(sourceResult => ({ ...sourceResult, url: new URL(sourceResult.url) }));
    }

    try {
      sourceResults = await this.handleInternal(ctx, type, id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        sourceResults = [];
      } else {
        throw error;
      }
    }

    await this.sourceResultCache.set<SourceResult[]>(cacheKey, sourceResults);

    return sourceResults;
  }
}
