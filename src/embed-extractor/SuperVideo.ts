import { EmbedExtractor } from './types';
import { extractUrlFromPacked, Fetcher, iso2ToFlag, scanFromResolution } from '../utils';
import { Context } from '../types';

export class SuperVideo implements EmbedExtractor {
  readonly id = 'supervideo';

  readonly label = 'SuperVideo';

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly supports = (url: URL): boolean => null !== url.host.match(/supervideo/);

  readonly extract = async (ctx: Context, url: URL, language: string) => {
    const normalizedUrl = url.toString().replace('/e/', '/').replace('/embed-', '/');
    const html = await this.fetcher.text(ctx, normalizedUrl);

    const resolutionAndSizeMatch = html.match(/(\d{3,}x\d{3,}), ([\d.]+) ?([GM]B)/) as string[];
    const resolution = scanFromResolution(resolutionAndSizeMatch[1] as string);
    const size = `${resolutionAndSizeMatch[2]} ${resolutionAndSizeMatch[3]}`;

    return {
      url: extractUrlFromPacked(html, [/sources:\[{file:"(.*?)"/]).toString(),
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
