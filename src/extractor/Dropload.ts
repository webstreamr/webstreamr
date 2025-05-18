import { Extractor } from './types';
import { extractUrlFromPacked, Fetcher } from '../utils';
import { Context } from '../types';
import bytes from 'bytes';

export class Dropload implements Extractor {
  readonly id = 'dropload';

  readonly label = 'Dropload';

  readonly ttl = 900000; // 15m

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly supports = (url: URL): boolean => null !== url.host.match(/dropload/);

  readonly extract = async (ctx: Context, url: URL, countryCode: string) => {
    url.pathname = url.pathname.replace('/e/', '').replace('/embed-', '/');
    const html = await this.fetcher.text(ctx, url);

    const heightMatch = html.match(/\d{3,}x(\d{3,}),/) as string[];

    const sizeMatch = html.match(/([\d.]+ ?[GM]B)/) as string[];

    return {
      url: extractUrlFromPacked(html, [/sources:\[{file:"(.*?)"/]),
      label: this.label,
      sourceId: `${this.id}_${countryCode.toLowerCase()}`,
      height: parseInt(heightMatch[1] as string) as number,
      bytes: bytes.parse(sizeMatch[1] as string) as number,
      countryCode,
    };
  };
}
