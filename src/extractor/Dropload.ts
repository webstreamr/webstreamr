import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { Extractor } from './types';
import { extractUrlFromPacked, Fetcher } from '../utils';
import { Context, Meta, UrlResult } from '../types';
import { NotFoundError } from '../error';

export class Dropload implements Extractor {
  readonly id = 'dropload';

  readonly label = 'Dropload';

  readonly ttl = 900000; // 15m

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly supports = (_ctx: Context, url: URL): boolean => null !== url.host.match(/dropload/);

  readonly normalize = (url: URL): URL => new URL(url.href.replace('/e/', '/').replace('/embed-', '/'));

  readonly extract = async (ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> => {
    const html = await this.fetcher.text(ctx, url);

    if (html.includes('File Not Found')) {
      throw new NotFoundError();
    }

    const heightMatch = html.match(/\d{3,}x(\d{3,}),/) as string[];

    const sizeMatch = html.match(/([\d.]+ ?[GM]B)/) as string[];

    const $ = cheerio.load(html);
    const title = $('.videoplayer h1').text().trim();

    return [
      {
        url: extractUrlFromPacked(html, [/sources:\[{file:"(.*?)"/]),
        label: this.label,
        sourceId: `${this.id}_${meta.countryCode.toLowerCase()}`,
        ttl: this.ttl,
        meta: {
          bytes: bytes.parse(sizeMatch[1] as string) as number,
          height: parseInt(heightMatch[1] as string) as number,
          title,
          ...meta,
        },
      },
    ];
  };
}
