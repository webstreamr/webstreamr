import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Id } from '../utils';

export interface SourceResult {
  countryCode: CountryCode;
  title?: string;
  url: URL;
}

export interface Source {
  readonly id: string;

  readonly label: string;

  readonly contentTypes: ContentType[];

  readonly countryCodes: CountryCode[];

  handle(ctx: Context, type: ContentType, id: Id): Promise<(SourceResult[])>;
}
