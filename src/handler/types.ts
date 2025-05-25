import { Context, CountryCode, UrlResult } from '../types';

export interface Handler {
  readonly id: string;

  readonly label: string;

  readonly contentTypes: string[];

  readonly countryCodes: CountryCode[];

  readonly handle: (ctx: Context, type: string, id: string) => Promise<(UrlResult | undefined)[]>;
}
