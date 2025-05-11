import { Manifest, ManifestConfig } from 'stremio-addon-sdk';

export interface Context { ip: string }

export type ManifestWithConfig = Manifest & { config: ManifestConfig[] };

export type Config = Record<string, string>;

export interface UrlResult {
  url: URL;
  label: string;
  sourceId: string;
  height: string | undefined;
  size: string | undefined;
  language: string | undefined;
}
