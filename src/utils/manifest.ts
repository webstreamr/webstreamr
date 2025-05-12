import { flag } from 'country-emoji';
import { Handler } from '../handler';
import { Config, ManifestWithConfig } from '../types';

export const buildManifest = (handlers: Handler[], config: Config): ManifestWithConfig => {
  const manifest: ManifestWithConfig = {
    id: process.env['MANIFEST_ID'] || 'webstreamr',
    version: '0.7.1', // x-release-please-version
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

  handlers.forEach((handler) => {
    manifest.config.push({
      key: handler.id,
      type: 'checkbox',
      title: `${handler.languages.map(language => flag(language) + ' ' + language.toUpperCase()).join(', ')} | ${handler.label}`,
      ...(handler.id in config && { default: 'checked' }),
    });
  });

  return manifest;
};
