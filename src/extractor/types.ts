import { Context, UrlResult } from '../types';

export interface Extractor {
  readonly id: string;

  readonly label: string;

  readonly ttl: number;

  readonly supports: (url: URL) => boolean;

  readonly extract: (ctx: Context, url: URL, countryCode: string) => Promise<UrlResult>;
}
