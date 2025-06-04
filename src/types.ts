import { Manifest, ManifestConfig } from 'stremio-addon-sdk';

export const TIMEOUT = 'timeout';

export interface Context {
  id: string;
  ip: string;
  config: Config;
  referer?: URL;
}

export type ManifestWithConfig = Manifest & { config: ManifestConfig[] };

export type Config = Partial<Record<CountryCode | 'excludeExternalUrls', string>>;

export type CountryCode = 'de' | 'en' | 'es' | 'fr' | 'it' | 'mx';

export type BlockedReason = 'cloudflare_challenge' | 'flaresolverr_failed' | 'unknown';

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
