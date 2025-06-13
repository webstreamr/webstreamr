import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { Extractor } from './Extractor';
import { extractUrlFromPacked, Fetcher } from '../utils';
import { Context, CountryCode, UrlResult } from '../types';
import { NotFoundError } from '../error';

export class Dropload extends Extractor {
  public readonly id = 'dropload';

  public readonly label = 'Dropload';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/dropload/);
  }

  public override readonly normalize = (url: URL): URL => new URL(url.href.replace('/e/', '/').replace('/embed-', '/'));

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> {
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
        sourceId: `${this.id}_${countryCode}`,
        ttl: this.ttl,
        meta: {
          bytes: bytes.parse(sizeMatch[1] as string) as number,
          countryCode,
          height: parseInt(heightMatch[1] as string) as number,
          title,
        },
      },
    ];
  };
}
