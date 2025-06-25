import { CountryCode } from '../types';

const countryCodeMap: Record<CountryCode, { language: string; flag: string; iso639: string }> = {
  de: { language: 'German', flag: '🇩🇪', iso639: 'ger' },
  en: { language: 'English', flag: '🇺🇸', iso639: 'eng' },
  es: { language: 'Castilian Spanish', flag: '🇪🇸', iso639: 'spa' },
  fr: { language: 'French', flag: '🇫🇷', iso639: 'fra' },
  it: { language: 'Italian', flag: '🇮🇹', iso639: 'ita' },
  mx: { language: 'Latin American Spanish', flag: '🇲🇽', iso639: 'spa' },
};

export const languageFromCountryCode = (countryCode: CountryCode) => {
  return countryCodeMap[countryCode].language;
};

export const flagFromCountryCode = (countryCode: CountryCode) => {
  return countryCodeMap[countryCode].flag;
};

export const iso639FromCountryCode = (countryCode: CountryCode) => {
  return countryCodeMap[countryCode].iso639;
};
