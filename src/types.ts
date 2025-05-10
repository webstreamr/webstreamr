import { Manifest, ManifestConfig, Stream } from 'stremio-addon-sdk';

export type ManifestWithConfig = Manifest & { config: ManifestConfig[] };

export type Config = Record<string, string>;

export type StreamWithMeta = Stream & { resolution: string | undefined; size: string | undefined };
