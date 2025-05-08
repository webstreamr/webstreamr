import { logWarn } from './log';

// Returns the scan from a resolution string. E.g. 720p for "1280x720"
// See https://en.wikipedia.org/wiki/List_of_common_display_resolutions#Digital_standards
export const scanFromResolution = (resolution: string): string | undefined => {
  const height = parseInt(resolution.split('x')[1]?.trim() || '');

  if (isNaN(height)) {
    logWarn(`"${resolution}" is not a valid resolution`);
    return undefined;
  }

  return `${height}p`;
};
