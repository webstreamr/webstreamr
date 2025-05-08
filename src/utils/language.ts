export const iso2ToFlag = (iso2: string): string => {
  const iso2Normalized = iso2.toLowerCase();

  if (iso2Normalized === 'de') {
    return '🇩🇪';
  }

  return '?';
};
