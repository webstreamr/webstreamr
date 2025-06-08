import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode, UrlResult } from '../types';
import { Id } from '../utils';

export interface Handler {
  readonly id: string;

  readonly label: string;

  readonly contentTypes: ContentType[];

  readonly countryCodes: CountryCode[];

  readonly handle: (ctx: Context, type: ContentType, id: Id) => Promise<(UrlResult | undefined)[]>;
}
