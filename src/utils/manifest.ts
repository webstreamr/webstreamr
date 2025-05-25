import { flag } from 'country-emoji';
import { Handler } from '../handler';
import { Config, ManifestWithConfig } from '../types';

export const buildManifest = (handlers: Handler[], config: Config): ManifestWithConfig => {
  const manifest: ManifestWithConfig = {
    id: process.env['MANIFEST_ID'] || 'webstreamr',
    version: '0.21.0', // x-release-please-version
    name: process.env['MANIFEST_NAME'] || 'WebStreamr',
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

  const countryCodeHandlers: Record<string, Handler[]> = {};
  handlers.forEach((handler) => {
    handler.countryCodes.forEach(countryCode => countryCodeHandlers[countryCode] = [...(countryCodeHandlers[countryCode] ?? []), handler]);
  });

  const sortedLanguageHandlers = Object.entries(countryCodeHandlers)
    .sort(([countryCodeA], [countryCodeB]) => countryCodeA.localeCompare(countryCodeB));

  for (const [countryCode, handlers] of sortedLanguageHandlers) {
    manifest.config.push({
      key: countryCode,
      type: 'checkbox',
      title: `${flag(countryCode)} (${handlers.map(handler => handler.label).join(', ')})`,
      ...(countryCode in config && { default: 'checked' }),
    });
  }

  return manifest;
};
