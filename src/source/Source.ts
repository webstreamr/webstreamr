import TTLCache from '@isaacs/ttlcache';
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

  private readonly sourceResultCache: TTLCache<string | number, SourceResult[]>;

  public constructor() {
    this.sourceResultCache = new TTLCache({ max: 1024, ttl: this.ttl });
  }

  protected abstract handleInternal(ctx: Context, type: ContentType, id: Id): Promise<(SourceResult[])>;

  public async handle(ctx: Context, type: ContentType, id: Id): Promise<(SourceResult[])> {
    if (this.sourceResultCache.has(id.id)) {
      return this.sourceResultCache.get(id.id) as SourceResult[];
    }

    let sourceResults: SourceResult[];
    try {
      sourceResults = await this.handleInternal(ctx, type, id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        sourceResults = [];
      } else {
        throw error;
      }
    }

    this.sourceResultCache.set(id.id, sourceResults);

    return sourceResults;
  }
}
