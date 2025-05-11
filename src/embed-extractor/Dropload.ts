import { EmbedExtractor } from './types';
import { extractUrlFromPacked, Fetcher, iso2ToFlag, scanFromResolution } from '../utils';
import { Context } from '../types';

export class Dropload implements EmbedExtractor {
  readonly id = 'dropload';

  readonly label = 'Dropload';

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly supports = (url: URL): boolean => null !== url.host.match(/dropload/);

  readonly extract = async (ctx: Context, url: URL, language: string) => {
    const normalizedUrl = url.toString().replace('/e/', '').replace('/embed-', '/');
    const html = await this.fetcher.text(ctx, normalizedUrl);

    const resolution = scanFromResolution((html.match(/(\d{3,}x\d{3,}),/) as string[])[1] as string);

    const sizeMatch = html.match(/([\d.]+) ?([GM]B)/) as string[];
    const size = `${sizeMatch[1]} ${sizeMatch[2]}`;

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
