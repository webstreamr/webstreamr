import { EmbedExtractor } from './types';
import { cachedFetchText, extractUrlFromPacked, iso2ToFlag, scanFromResolution } from '../utils';

export class Dropload implements EmbedExtractor {
  readonly id = 'dropload';

  readonly label = 'Dropload';

  readonly extract = async (url: string, language: string) => {
    const normalizedUrl = url.replace('/e/', '').replace('/embed-', '/');
    const html = await cachedFetchText(normalizedUrl);

    const resolution = scanFromResolution((html.match(/(\d{3,}x\d{3,}),/) as string[])[1] as string);

    const sizeMatch = html.match(/([\d.]+) ?([GM]B)/) as string[];
    const size = `${sizeMatch[1]} ${sizeMatch[2]}`;

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
