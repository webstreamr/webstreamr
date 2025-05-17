import { flag } from 'country-emoji';
import { Handler } from '../handler';
import { Config, ManifestWithConfig } from '../types';

export const buildManifest = (handlers: Handler[], config: Config): ManifestWithConfig => {
  const manifest: ManifestWithConfig = {
    id: process.env['MANIFEST_ID'] || 'webstreamr',
    version: '0.17.0', // x-release-please-version
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
      signature: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..LGh2NOomg-FHxI8EM8VB0w.4G41HLQqiuiawXUkV7klGEa09X0HfH-ZHOUe7vGX42elE8U4VxpNfpxpxUfLvZBFxXO5g-unsphRtHxpldMPotKZWeUlBsIVEGG8WiO9ctfYg-SuPL9r9iRQOuupC4D7.pEcMKHkPsL2Ps4xuo0Tg2Q',
    },
  };

  const languageHandlers: Record<string, Handler[]> = {};
  handlers.forEach((handler) => {
    handler.languages.forEach(language => languageHandlers[language] = [...(languageHandlers[language] ?? []), handler]);
  });

  const sortedLanguageHandlers = Object.entries(languageHandlers)
    .sort(([languageA], [languageB]) => languageA.localeCompare(languageB));

  for (const [language, handlers] of sortedLanguageHandlers) {
    manifest.config.push({
      key: language,
      type: 'checkbox',
      title: `${flag(language)} (${handlers.map(handler => handler.label).join(', ')})`,
      ...(language in config && { default: 'checked' }),
    });
  }

  return manifest;
};
