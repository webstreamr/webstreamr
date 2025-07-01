import { Config } from '../types';

export const getDefaultConfig = (): Config => {
  return { en: 'on' };
};

export const showExternalUrls = (config: Config): boolean => 'includeExternalUrls' in config;
