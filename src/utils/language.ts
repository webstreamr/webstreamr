import { CountryCode } from '../types';

const countryCodeMap: Record<CountryCode, { language: string; flag: string; iso639: string | undefined }> = {
  multi: { language: 'Multi', flag: '🌐', iso639: undefined },
  de: { language: 'German', flag: '🇩🇪', iso639: 'ger' },
  en: { language: 'English', flag: '🇺🇸', iso639: 'eng' },
  es: { language: 'Castilian Spanish', flag: '🇪🇸', iso639: 'spa' },
  fr: { language: 'French', flag: '🇫🇷', iso639: 'fra' },
  hi: { language: 'Hindi', flag: '🇮🇳', iso639: 'hin' },
  it: { language: 'Italian', flag: '🇮🇹', iso639: 'ita' },
  ja: { language: 'Japanese', flag: '🇯🇵', iso639: 'jpn' },
  ko: { language: 'Korean', flag: '🇰🇷', iso639: 'kor' },
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

export const findCountryCodes = (value: string): CountryCode[] => {
  const countryCodes: CountryCode[] = [];

  for (const countryCode in countryCodeMap) {
    if (value.includes(countryCodeMap[countryCode as CountryCode]['language'])) {
      countryCodes.push(countryCode as CountryCode);
    }
  }

  return countryCodes;
};
