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
