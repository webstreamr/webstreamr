import { Manifest, ManifestConfig } from 'stremio-addon-sdk';

export interface Context {
  id: string;
  ip: string;
  config: Config;
}

export type ManifestWithConfig = Manifest & { config: ManifestConfig[] };

export type Config = Record<string, string>;

export interface Meta {
  bytes?: number;
  countryCode: string;
  height?: number;
}

export interface UrlResult {
  url: URL;
  isExternal?: boolean;
  label: string;
  sourceId: string;
  meta: Meta;
  requestHeaders?: Record<string, string>;
}
