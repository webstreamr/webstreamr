import { Manifest, ManifestConfig } from 'stremio-addon-sdk';

export interface Context {
  id: string;
  ip: string;
  config: Config;
}

export type ManifestWithConfig = Manifest & { config: ManifestConfig[] };

export type Config = Record<string, string>;

export interface UrlResult {
  url: URL;
  isExternal?: boolean;
  label: string;
  sourceId: string;
  height: number;
  bytes: number;
  countryCode?: string;
  requestHeaders?: Record<string, string>;
}
