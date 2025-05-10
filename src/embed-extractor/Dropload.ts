import { EmbedExtractor } from './types';
import { cachedFetchText, extractUrlFromPacked, iso2ToFlag, scanFromResolution } from '../utils';

export class Dropload implements EmbedExtractor {
  readonly id = 'dropload';

  readonly label = 'Dropload';

  readonly extract = async (url: string, language: string) => {
    const normalizedUrl = url.replace('/e/', '').replace('/embed-', '/');
    const html = await cachedFetchText(normalizedUrl);

    const resolutionMatch = html.match(/(\d{3,}x\d{3,}),/);
    const resolution = resolutionMatch && resolutionMatch[1] ? scanFromResolution(resolutionMatch[1]) : undefined;

    const sizeMatch = html.match(/([\d.]+) ?([GM]B)/);
    const size = sizeMatch && sizeMatch[1] && sizeMatch[2] ? `${sizeMatch[1]} ${sizeMatch[2]}` : undefined;

    return {
      url: await extractUrlFromPacked(html, [/sources:\[{file:"(.*?)"/]),
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
