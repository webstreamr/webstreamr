import { CountryCode } from '../types';

const countryCodeMap: Record<CountryCode, { language: string; flag: string; iso639: string | undefined }> = {
  multi: { language: 'Multi', flag: '🌐', iso639: undefined },
  al: { language: 'Albanian', flag: '🇦🇱', iso639: 'sq' },
  ar: { language: 'Arabic', flag: '🇸🇦', iso639: 'ara' },
  bg: { language: 'Bulgarian', flag: '🇧🇬', iso639: 'bul' },
  cs: { language: 'Czech', flag: '🇨🇿', iso639: 'ces' },
  de: { language: 'German', flag: '🇩🇪', iso639: 'ger' },
  el: { language: 'Greek', flag: '🇬🇷', iso639: 'gre' },
  en: { language: 'English', flag: '🇺🇸', iso639: 'eng' },
  es: { language: 'Castilian Spanish', flag: '🇪🇸', iso639: 'spa' },
  et: { language: 'Estonian', flag: '🇪🇪', iso639: 'est' },
  fa: { language: 'Persian', flag: '🇮🇷', iso639: 'fas' },
  fr: { language: 'French', flag: '🇫🇷', iso639: 'fra' },
  he: { language: 'Hebrew', flag: '🇮🇱', iso639: 'heb' },
  hi: { language: 'Hindi', flag: '🇮🇳', iso639: 'hin' },
  hr: { language: 'Croatian', flag: '🇭🇷', iso639: 'hrv' },
  hu: { language: 'Hungarian', flag: '🇭🇺', iso639: 'hun' },
  id: { language: 'Indonesian', flag: '🇮🇩', iso639: 'ind' },
  it: { language: 'Italian', flag: '🇮🇹', iso639: 'ita' },
  ja: { language: 'Japanese', flag: '🇯🇵', iso639: 'jpn' },
  ko: { language: 'Korean', flag: '🇰🇷', iso639: 'kor' },
  lt: { language: 'Lithuanian', flag: '🇱🇹', iso639: 'lit' },
  lv: { language: 'Latvian', flag: '🇱🇻', iso639: 'lav' },
  mx: { language: 'Latin American Spanish', flag: '🇲🇽', iso639: 'spa' },
  nl: { language: 'Dutch', flag: '🇳🇱', iso639: 'nld' },
  no: { language: 'Norwegian', flag: '🇳🇴', iso639: 'nor' },
  pl: { language: 'Polish', flag: '🇵🇱', iso639: 'pol' },
  pt: { language: 'Portuguese', flag: '🇧🇷', iso639: 'por' },
  ro: { language: 'Romanian', flag: '🇷🇴', iso639: 'ron' },
  ru: { language: 'Russian', flag: '🇷🇺', iso639: 'rus' },
  sk: { language: 'Slovak', flag: '🇸🇰', iso639: 'slk' },
  sl: { language: 'Slovenian', flag: '🇸🇮', iso639: 'slv' },
  sr: { language: 'Serbian', flag: '🇷🇸', iso639: 'srp' },
  th: { language: 'Thai', flag: '🇹🇭', iso639: 'tha' },
  tr: { language: 'Turkish', flag: '🇹🇷', iso639: 'tur' },
  uk: { language: 'Ukrainian', flag: '🇺🇦', iso639: 'ukr' },
  vi: { language: 'Vietnamese', flag: '🇻🇳', iso639: 'vie' },
  zh: { language: 'Chinese', flag: '🇨🇳', iso639: 'zho' },
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
