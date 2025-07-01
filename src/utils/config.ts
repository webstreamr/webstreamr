import { Config } from '../types';

export const getDefaultConfig = (): Config => {
  return { multi: 'on', en: 'on' };
};

export const showExternalUrls = (config: Config): boolean => 'includeExternalUrls' in config;

export const hasMultiEnabled = (config: Config): boolean => 'multi' in config;
