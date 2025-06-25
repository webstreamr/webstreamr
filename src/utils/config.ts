import { Config, CountryCode } from '../types';

export const getDefaultConfig = (): Config => {
  return { en: 'on' };
};

const isCountryCode = (key: string): key is CountryCode => {
  return Object.values(CountryCode).includes(key as CountryCode);
};

export const getCountryCodes = (config: Config): CountryCode[] => {
  const countryCodes: CountryCode[] = [];

  for (const key in config) {
    if (isCountryCode(key)) {
      countryCodes.push(key);
    }
  }

  return countryCodes;
};

export const showExternalUrls = (config: Config): boolean => 'includeExternalUrls' in config;
