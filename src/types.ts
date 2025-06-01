import { Manifest, ManifestConfig } from 'stremio-addon-sdk';

export interface Context {
  id: string;
  ip: string;
  config: Config;
  referer?: URL;
}

export type ManifestWithConfig = Manifest & { config: ManifestConfig[] };

export type Config = Partial<Record<CountryCode | 'excludeExternalUrls', string>>;

export type CountryCode = 'de' | 'en' | 'es' | 'fr' | 'it' | 'mx';

export type BlockedReason = 'cloudflare_challenge' | 'unknown';

export interface Meta {
  bytes?: number;
  countryCode: CountryCode;
  height?: number;
  title?: string;
}

export interface UrlResult {
  url: URL;
  isExternal?: boolean;
  blocked?: BlockedReason;
  label: string;
  sourceId?: string;
  meta: Meta;
  requestHeaders?: Record<string, string>;
}
