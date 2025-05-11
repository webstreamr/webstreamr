import { EmbedExtractor } from './types';
import { extractUrlFromPacked, Fetcher } from '../utils';
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

    const heightAndSizeMatch = html.match(/\d{3,}x(\d{3,}), ([\d.]+) ?([GM]B)/) as string[];
    const height = heightAndSizeMatch[1];
    const size = `${heightAndSizeMatch[2]} ${heightAndSizeMatch[3]}`;

    return {
      url: extractUrlFromPacked(html, [/sources:\[{file:"(.*?)"/]),
      label: this.label,
      sourceId: this.id,
      height,
      size,
      language,
    };
  };
}
