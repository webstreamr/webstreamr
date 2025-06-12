import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Id } from '../utils';

export interface HandleResult {
  countryCode: CountryCode;
  referer?: URL;
  title?: string;
  url: URL;
}

export interface Handler {
  readonly id: string;

  readonly label: string;

  readonly contentTypes: ContentType[];

  readonly countryCodes: CountryCode[];

  readonly handle: (ctx: Context, type: ContentType, id: Id) => Promise<(HandleResult[])>;
}
