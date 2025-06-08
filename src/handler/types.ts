import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode, UrlResult } from '../types';

export interface Handler {
  readonly id: string;

  readonly label: string;

  readonly contentTypes: ContentType[];

  readonly countryCodes: CountryCode[];

  readonly handle: (ctx: Context, type: ContentType, id: string) => Promise<(UrlResult | undefined)[]>;
}
