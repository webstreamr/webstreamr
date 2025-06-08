import { Context, Meta, UrlResult } from '../types';

export interface Extractor {
  readonly id: string;

  readonly label: string;

  readonly ttl: number;

  readonly supports: (ctx: Context, url: URL) => boolean;

  readonly extract: (ctx: Context, url: URL, meta: Meta) => Promise<UrlResult[]>;
}
