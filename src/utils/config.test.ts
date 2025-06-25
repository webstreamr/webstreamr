import { getCountryCodes, getDefaultConfig } from './config';

describe('getDefaultConfig', () => {
  test('has English enabled', () => {
    expect(getDefaultConfig().en).toBe('on');
  });
});

describe('getCountryCodes', () => {
  test('returns only all country codes', () => {
    expect(getCountryCodes({ de: 'on', en: 'on', includeExternalUrls: 'on' })).toStrictEqual(['de', 'en']);
  });
});
