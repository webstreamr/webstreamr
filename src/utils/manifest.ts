import { Extractor } from '../extractor';
import { Source } from '../source';
import { Config, CountryCode, CustomManifest } from '../types';
import { disableExtractorConfigKey, isExtractorDisabled } from './config';
import { envGetAppId, envGetAppName } from './env';
import { flagFromCountryCode, languageFromCountryCode } from './language';

const typedEntries = <T extends object>(obj: T): [keyof T, T[keyof T]][] => (Object.entries(obj) as [keyof T, T[keyof T]][]);

export const buildManifest = (sources: Source[], extractors: Extractor[], config: Config): CustomManifest => {
  const manifest: CustomManifest = {
    id: envGetAppId(),
    version: '0.58.10', // x-release-please-version
    name: envGetAppName(),
    description: 'Provides HTTP URLs from streaming websites. Configure add-on for additional languages. Add MediaFlow proxy for more URLs.',
    resources: [
      'stream',
    ],
    types: [
      'movie',
      'series',
    ],
    catalogs: [],
    idPrefixes: ['tmdb:', 'tt'],
    logo: 'https://emojiapi.dev/api/v1/spider_web/256.png',
    behaviorHints: {
      p2p: false,
      configurable: true,
      configurationRequired: false,
    },
    config: [],
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

  const languages: string[] = [];
  for (const [countryCode, sources] of sortedLanguageSources) {
    const language = languageFromCountryCode(countryCode);
    languages.push(language);

    manifest.config.push({
      key: countryCode,
      type: 'checkbox',
      title: `${language} ${flagFromCountryCode(countryCode)} (${(sources as Source[]).map(source => source.label).sort().join(', ')})`,
      ...(countryCode in config && { default: 'checked' }),
    });
  }

  manifest.config.push({
    key: 'showErrors',
    type: 'checkbox',
    title: 'Show errors',
    ...('showErrors' in config && { default: 'checked' }),
  });

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

  extractors.forEach((extractor) => {
    if (extractor.id === 'external') {
      return;
    }

    manifest.config.push({
      key: disableExtractorConfigKey(extractor),
      type: 'checkbox',
      title: `Disable extractor ${extractor.label}`,
      ...(isExtractorDisabled(config, extractor) && { default: 'checked' }),
    });
  });

  manifest.description += `\n\nSupported languages: ${languages.filter(language => language !== 'Multi').join(', ')}`;
  manifest.description += `\n\nSupported sources: ${sources.map(source => source.label).join(', ')}`;
  manifest.description += `\n\nSupported extractors: ${extractors.map(extractor => extractor.label).join(', ')}`;

  return manifest;
};
