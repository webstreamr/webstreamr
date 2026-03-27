export const RESOLUTIONS = [
  '2160p',
  '1440p',
  '1080p',
  '720p',
  '576p',
  '480p',
  '360p',
  '240p',
  '144p',
  'Unknown',
] as const;

export const getClosestResolution = (height: number | undefined) => {
  if (!height) {
    return 'Unknown';
  }

  return `${RESOLUTIONS.map(r => Number(r.replace('p', '')))
    .filter(n => !isNaN(n))
    .reduce((prev, curr) => {
      return Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev;
    })}p`;
};

export const findHeight = (value: string): number | undefined => {
  /* istanbul ignore next */
  const height = parseInt(RESOLUTIONS.find(res => value.toLowerCase().includes(res))?.replace('p', '') ?? '', 10);

  /* istanbul ignore next */
  return isNaN(height) ? undefined : height;
};
