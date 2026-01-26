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
  al = 'al',
  ar = 'ar',
  bg = 'bg',
  bl = 'bl',
  cs = 'cs',
  de = 'de',
  el = 'el',
  en = 'en',
  es = 'es',
  et = 'et',
  fa = 'fa',
  fr = 'fr',
  gu = 'gu',
  he = 'he',
  hi = 'hi',
  hr = 'hr',
  hu = 'hu',
  id = 'id',
  it = 'it',
  ja = 'ja',
  kn = 'kn',
  ko = 'ko',
  lt = 'lt',
  lv = 'lv',
  ml = 'ml',
  mr = 'mr',
  mx = 'mx',
  nl = 'nl',
  no = 'no',
  pa = 'pa',
  pl = 'pl',
  pt = 'pt',
  ro = 'ro',
  ru = 'ru',
  sk = 'sk',
  sl = 'sl',
  sr = 'sr',
  ta = 'ta',
  te = 'te',
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
  extractorId?: string | undefined;
  height?: number | undefined;
  priority?: number | undefined;
  referer?: string | undefined;
  sourceId?: string | undefined;
  sourceLabel?: string | undefined;
  title?: string | undefined;
}

export enum Format {
  hls = 'hls',
  mp4 = 'mp4',
  unknown = 'unknown',
}

export interface InternalUrlResult {
  url: URL;
  format: Format;
  isExternal?: boolean;
  ytId?: string;
  error?: unknown;
  label?: string;
  meta?: Meta;
  requestHeaders?: Record<string, string>;
}

export interface UrlResult {
  url: URL;
  format: Format;
  isExternal?: boolean;
  ytId?: string;
  error?: unknown;
  label: string;
  ttl: number;
  meta?: Meta;
  notWebReady?: boolean;
  requestHeaders?: Record<string, string>;
}
