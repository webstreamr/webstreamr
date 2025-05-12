import { Context, UrlResult } from '../types';

export interface EmbedExtractor {
  readonly id: string;

  readonly label: string;

  readonly ttl: number;

  readonly supports: (url: URL) => boolean;

  readonly extract: (ctx: Context, url: URL, language: string) => Promise<UrlResult>;
}
