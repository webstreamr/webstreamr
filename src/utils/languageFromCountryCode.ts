import { CountryCode } from '../types';

const countryCodeLanguageMap: Record<CountryCode, string> = {
  de: 'German',
  en: 'English',
  es: 'Castilian Spanish',
  fr: 'French',
  it: 'Italian',
  mx: 'Latin American Spanish',
};

export const languageFromCountryCode = (countryCode: CountryCode) => {
  return countryCodeLanguageMap[countryCode];
};
