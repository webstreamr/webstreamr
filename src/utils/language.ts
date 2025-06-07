import { CountryCode } from '../types';

const countryCodeMap: Record<CountryCode, { language: string; flag: string }> = {
  de: { language: 'German', flag: '🇩🇪' },
  en: { language: 'English', flag: '🇺🇸' },
  es: { language: 'Castilian Spanish', flag: '🇪🇸' },
  fr: { language: 'French', flag: '🇫🇷' },
  it: { language: 'Italian', flag: '🇮🇹' },
  mx: { language: 'Latin American Spanish', flag: '🇲🇽' },
};

export const languageFromCountryCode = (countryCode: CountryCode) => {
  return countryCodeMap[countryCode].language;
};

export const flagFromCountryCode = (countryCode: CountryCode) => {
  return countryCodeMap[countryCode].flag;
};
