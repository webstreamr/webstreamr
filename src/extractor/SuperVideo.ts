import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { Extractor } from './types';
import { extractUrlFromPacked, Fetcher } from '../utils';
import { Context, Meta } from '../types';

export class SuperVideo implements Extractor {
  readonly id = 'supervideo';

  readonly label = 'SuperVideo';

  readonly ttl = 900000; // 15m

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly supports = (_ctx: Context, url: URL): boolean => null !== url.host.match(/supervideo/);

  readonly extract = async (ctx: Context, url: URL, meta: Meta) => {
    const normalizedUrl = new URL(url.href.replace('/e/', '/').replace('/embed-', '/'));
    const html = await this.fetcher.text(ctx, normalizedUrl);

    const heightAndSizeMatch = html.match(/\d{3,}x(\d{3,}), ([\d.]+ ?[GM]B)/) as string[];

    const $ = cheerio.load(html);
    const title = $('title').text().trim().replace(/^Watch /, '').trim();

    return [
      {
        url: extractUrlFromPacked(html, [/sources:\[{file:"(.*?)"/]),
        label: this.label,
        sourceId: `${this.id}_${meta.countryCode.toLowerCase()}`,
        ttl: this.ttl,
        meta: {
          bytes: bytes.parse(heightAndSizeMatch[2] as string) as number,
          height: parseInt(heightAndSizeMatch[1] as string) as number,
          title,
          ...meta,
        },
      },
    ];
  };
}
