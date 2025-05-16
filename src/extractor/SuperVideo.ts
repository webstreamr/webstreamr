import bytes from 'bytes';
import { Extractor } from './types';
import { extractUrlFromPacked, Fetcher } from '../utils';
import { Context } from '../types';

export class SuperVideo implements Extractor {
  readonly id = 'supervideo';

  readonly label = 'SuperVideo';

  readonly ttl = 900000; // 15m

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly supports = (url: URL): boolean => null !== url.host.match(/supervideo/);

  readonly extract = async (ctx: Context, url: URL, countryCode: string) => {
    const normalizedUrl = url.toString().replace('/e/', '/').replace('/embed-', '/');
    const html = await this.fetcher.text(ctx, new URL(normalizedUrl));

    const heightAndSizeMatch = html.match(/\d{3,}x(\d{3,}), ([\d.]+ ?[GM]B)/) as string[];

    return {
      url: extractUrlFromPacked(html, [/sources:\[{file:"(.*?)"/]),
      label: this.label,
      sourceId: `${this.id}_${countryCode.toLowerCase()}`,
      height: parseInt(heightAndSizeMatch[1] as string) as number,
      bytes: bytes.parse(heightAndSizeMatch[2] as string) as number,
      countryCode,
    };
  };
}
