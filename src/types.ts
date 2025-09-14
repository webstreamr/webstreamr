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

export type Config = Partial<Record<CountryCode | 'showErrors' | 'includeExternalUrls' | 'mediaFlowProxyUrl' | 'mediaFlowProxyPassword' | 'proxyConfig' | 'noCache', string> & Record<`disableExtractor_${string}`, string>>;

export enum CountryCode {
  multi = 'multi',
  ar = 'ar',
  bg = 'bg',
  cs = 'cs',
  de = 'de',
  el = 'el',
  en = 'en',
  es = 'es',
  et = 'et',
  fa = 'fa',
  fr = 'fr',
  he = 'he',
  hi = 'hi',
  hr = 'hr',
  hu = 'hu',
  id = 'id',
  it = 'it',
  ja = 'ja',
  ko = 'ko',
  lt = 'lt',
  lv = 'lv',
  mx = 'mx',
  nl = 'nl',
  no = 'no',
  pl = 'pl',
  pt = 'pt',
  ro = 'ro',
  ru = 'ru',
  sk = 'sk',
  sl = 'sl',
  sr = 'sr',
  th = 'th',
  tr = 'tr',
  uk = 'uk',
  vi = 'vi',
  zh = 'zh',
}

export enum BlockedReason {
  cloudflare_challenge = 'cloudflare_challenge',
  flaresolverr_failed = 'flaresolverr_failed',
  cloudflare_censor = 'cloudflare_censor',
  media_flow_proxy_auth = 'media_flow_proxy_auth',
  unknown = 'unknown',
}

export interface Meta {
  bytes?: number | undefined;
  countryCodes?: CountryCode[];
  height?: number | undefined;
  referer?: string | undefined;
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
  meta?: Meta;
  notWebReady?: boolean;
  requestHeaders?: Record<string, string>;
}
