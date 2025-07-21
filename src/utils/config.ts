import { Extractor } from '../extractor';
import { Config } from '../types';

export const getDefaultConfig = (): Config => {
  return { multi: 'on', en: 'on' };
};

export const showExternalUrls = (config: Config): boolean => 'includeExternalUrls' in config;

export const hasMultiEnabled = (config: Config): boolean => 'multi' in config;

export const disableExtractorConfigKey = (extractor: Extractor): string => `disableExtractor_${extractor.id}`;

export const isExtractorDisabled = (config: Config, extractor: Extractor): boolean => disableExtractorConfigKey(extractor) in config;
