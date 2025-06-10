export const guessFromTitle = (title: string): number | undefined => {
  const heightMatch = title.match(/([0-9]+)p/);
  if (heightMatch && heightMatch[1]) {
    return parseInt(heightMatch[1]);
  }

  return undefined;
};
