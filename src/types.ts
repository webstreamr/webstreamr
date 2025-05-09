import { Manifest, ManifestConfig } from 'stremio-addon-sdk';

export type ManifestWithConfig = Manifest & { config: ManifestConfig[] };

export type Config = Record<string, string>;
