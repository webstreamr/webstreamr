import { ContentType } from 'stremio-addon-sdk';
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

  public abstract readonly contentTypes: ContentType[];

  public abstract readonly countryCodes: CountryCode[];

  public abstract readonly baseUrl: string;

  protected abstract handleInternal(ctx: Context, type: ContentType, id: Id): Promise<(SourceResult[])>;

  public async handle(ctx: Context, type: ContentType, id: Id): Promise<(SourceResult[])> {
    return await this.handleInternal(ctx, type, id);
  }
}
