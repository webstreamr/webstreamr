import { iso2ToFlag } from './language';

describe('iso2ToFlag', () => {
  test('returns flag for known language', () => {
    expect(iso2ToFlag('DE')).toBe('🇩🇪');
    expect(iso2ToFlag('de')).toBe('🇩🇪');
  });

  test('returns "?" for unknown language', () => {
    expect(iso2ToFlag('XX')).toBe('?');
  });
});
