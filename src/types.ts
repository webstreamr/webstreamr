import { Manifest, ManifestConfig } from 'stremio-addon-sdk';

export interface Context {
  id: string;
  ip: string;
  config: Config;
}

export type ManifestWithConfig = Manifest & { config: ManifestConfig[] };

export type Config = Partial<Record<CountryCode | 'excludeExternalUrls', string>>;

export enum CountryCode {
  de = 'de',
  en = 'en',
  es = 'es',
  fr = 'fr',
  it = 'it',
  mx = 'mx',
}

export enum BlockedReason {
  cloudflare_challenge = 'cloudflare_challenge',
  flaresolverr_failed = 'flaresolverr_failed',
  unknown = 'unknown',
}

export interface Meta {
  bytes?: number;
  countryCode: CountryCode;
  height?: number;
  title?: string;
}

export interface UrlResult {
  url: URL;
  isExternal?: boolean;
  error?: unknown;
  label: string;
  sourceId: string;
  ttl?: number;
  meta: Meta;
  requestHeaders?: Record<string, string>;
}
