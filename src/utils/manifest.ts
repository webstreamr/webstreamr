import { Source } from '../source';
import { Config, CountryCode, ManifestWithConfig } from '../types';
import { envGetAppId, envGetAppName } from './env';
import { flagFromCountryCode, languageFromCountryCode } from './language';

const typedEntries = <T extends object>(obj: T): [keyof T, T[keyof T]][] => (Object.entries(obj) as [keyof T, T[keyof T]][]);

export const buildManifest = (sources: Source[], config: Config): ManifestWithConfig => {
  const manifest: ManifestWithConfig = {
    id: envGetAppId(),
    version: '0.39.1', // x-release-please-version
    name: envGetAppName(),
    description: 'Provides HTTP URLs from streaming websites.',
    resources: [
      'stream',
    ],
    types: [
      'movie',
      'series',
    ],
    catalogs: [],
    idPrefixes: ['tt'],
    behaviorHints: {
      p2p: false,
      configurable: true,
      configurationRequired: Object.keys(config).length === 0,
    },
    config: [],
    // @ts-expect-error inofficial prop needed for add-on claiming on https://stremio-addons.net
    stremioAddonsConfig: {
      issuer: 'https://stremio-addons.net',
      signature: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..D3-Wl15vxnYltwx8G52rRg.16-0VzsSgTvnv0wampIR8YPZsFhH8-7IgpuqxcUfC2p7kIJtuk8xQzrzqQOLXANEpaH_w7a4JOEpNo8wv28Zo_nMGCLOXgWbyGM3sQ-tfq6DCK3JU0ol6YMC1UDX2z_c.IOLlZyTYx_swutjYSTES0Q',
    },
  };

  const countryCodeSources: Partial<Record<CountryCode, Source[]>> = {};
  sources.forEach(source =>
    source.countryCodes
      .forEach(countryCode => countryCodeSources[countryCode] = [...(countryCodeSources[countryCode] ?? []), source]));

  const sortedLanguageSources = typedEntries(countryCodeSources)
    .sort(([countryCodeA], [countryCodeB]) => {
      if (countryCodeB === CountryCode.multi) {
        return 1;
      }

      return countryCodeA.localeCompare(countryCodeB);
    });

  for (const [countryCode, sources] of sortedLanguageSources) {
    manifest.config.push({
      key: countryCode,
      type: 'checkbox',
      title: `${languageFromCountryCode(countryCode)} ${flagFromCountryCode(countryCode)} (${(sources as Source[]).map(handler => handler.label).join(', ')})`,
      ...(countryCode in config && { default: 'checked' }),
    });
  }

  manifest.config.push({
    key: 'includeExternalUrls',
    type: 'checkbox',
    title: 'Include external URLs in results',
    ...('includeExternalUrls' in config && { default: 'checked' }),
  });

  manifest.config.push({
    key: 'mediaFlowProxyUrl',
    type: 'text',
    title: 'MediaFlow Proxy URL',
    default: config['mediaFlowProxyUrl'] ?? '',
  });

  manifest.config.push({
    key: 'mediaFlowProxyPassword',
    type: 'password',
    title: 'MediaFlow Proxy Password',
    default: config['mediaFlowProxyPassword'] ?? '',
  });

  return manifest;
};
