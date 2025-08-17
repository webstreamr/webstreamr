import { Manifest, ManifestConfig } from 'stremio-addon-sdk';

export type NonEmptyArray<T> = [T, ...T[]];

export interface Context {
  hostUrl: URL;
  id: string;
  ip?: string;
  config: Config;
}

export type CustomManifest = Manifest & {
  config: ManifestConfig[];
  stremioAddonsConfig: { // needed for add-on claiming on https://stremio-addons.net
    issuer: string;
    signature: string;
  };
};

export type Config = Partial<Record<CountryCode | 'showErrors' | 'includeExternalUrls' | 'mediaFlowProxyUrl' | 'mediaFlowProxyPassword', string> & Record<`disableExtractor_${string}`, string>>;

export enum CountryCode {
  multi = 'multi',
  de = 'de',
  en = 'en',
  es = 'es',
  fr = 'fr',
  it = 'it',
  ja = 'ja',
  ko = 'ko',
  mx = 'mx',
}

export enum BlockedReason {
  cloudflare_challenge = 'cloudflare_challenge',
  flaresolverr_failed = 'flaresolverr_failed',
  cloudflare_censor = 'cloudflare_censor',
  media_flow_proxy_auth = 'media_flow_proxy_auth',
  unknown = 'unknown',
}

export interface Meta {
  bytes?: number;
  countryCodes: CountryCode[];
  height?: number | undefined;
  title?: string | undefined;
}

export enum Format {
  hls = 'hls',
  mp4 = 'mp4',
  unknown = 'unknown',
}

export interface UrlResult {
  url: URL;
  format: Format;
  isExternal?: boolean;
  ytId?: string;
  error?: unknown;
  label: string;
  sourceId: string;
  ttl?: number;
  meta: Meta;
  notWebReady?: boolean;
  requestHeaders?: Record<string, string>;
}
