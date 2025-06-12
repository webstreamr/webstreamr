import { Context, CountryCode, UrlResult } from '../types';

export interface Extractor {
  readonly id: string;

  readonly label: string;

  readonly ttl: number;

  readonly supports: (ctx: Context, url: URL) => boolean;

  readonly normalize: (url: URL) => URL;

  readonly extract: (ctx: Context, url: URL, countryCode: CountryCode, title?: string | undefined) => Promise<UrlResult[]>;
}
