import { Handler } from '../handler';
import { Config, CountryCode, ManifestWithConfig } from '../types';
import { envGetAppId, envGetAppName } from './env';
import { flagFromCountryCode, languageFromCountryCode } from './language';

const typedEntries = <T extends object>(obj: T): [keyof T, T[keyof T]][] => (Object.entries(obj) as [keyof T, T[keyof T]][]);

export const buildManifest = (handlers: Handler[], config: Config): ManifestWithConfig => {
  const manifest: ManifestWithConfig = {
    id: envGetAppId(),
    version: '0.26.1', // x-release-please-version
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

  const countryCodeHandlers: Partial<Record<CountryCode, Handler[]>> = {};
  handlers.forEach((handler) => {
    handler.countryCodes.forEach(countryCode => countryCodeHandlers[countryCode] = [...(countryCodeHandlers[countryCode] ?? []), handler]);
  });

  const sortedLanguageHandlers = typedEntries(countryCodeHandlers)
    .sort(([countryCodeA], [countryCodeB]) => countryCodeA.localeCompare(countryCodeB));

  for (const [countryCode, handlers] of sortedLanguageHandlers) {
    manifest.config.push({
      key: countryCode,
      type: 'checkbox',
      title: `${languageFromCountryCode(countryCode)} ${flagFromCountryCode(countryCode)} (${(handlers as Handler[]).map(handler => handler.label).join(', ')})`,
      ...(countryCode in config && { default: 'checked' }),
    });
  }

  manifest.config.push({
    key: 'excludeExternalUrls',
    type: 'checkbox',
    title: 'Exclude external URLs from results',
  });

  return manifest;
};
