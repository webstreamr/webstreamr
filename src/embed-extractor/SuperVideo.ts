import { EmbedExtractor } from './types';
import { cachedFetchText, extractUrlFromPacked, iso2ToFlag, scanFromResolution } from '../utils';

export class SuperVideo implements EmbedExtractor {
  readonly id = 'supervideo';

  readonly label = 'SuperVideo';

  readonly extract = async (url: string, language: string) => {
    const normalizedUrl = url.replace('/e/', '/').replace('/embed-', '/');
    const html = await cachedFetchText(normalizedUrl);

    const resolutionAndSizeMatch = html.match(/(\d{3,}x\d{3,}), ([\d.]+) ?([GM]B)/) as string[];
    const resolution = scanFromResolution(resolutionAndSizeMatch[1] as string);
    const size = `${resolutionAndSizeMatch[2]} ${resolutionAndSizeMatch[3]}`;

    return {
      url: extractUrlFromPacked(html, [/sources:\[{file:"(.*?)"/]),
      name: `WebStreamr ${resolution}`,
      title: `${this.label} | 💾 ${size} | ${iso2ToFlag(language)}`,
      behaviorHints: {
        group: `webstreamr-${this.id}`,
      },
      resolution,
      size,
    };
  };
}
