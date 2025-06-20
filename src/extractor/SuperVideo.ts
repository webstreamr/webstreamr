import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { Extractor } from './Extractor';
import { extractUrlFromPacked, Fetcher } from '../utils';
import { Context, CountryCode, Format, UrlResult } from '../types';
import { NotFoundError } from '../error';

export class SuperVideo extends Extractor {
  public readonly id = 'supervideo';

  public readonly label = 'SuperVideo';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/supervideo/);
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace('/e/', '/').replace('/embed-', '/'));
  }

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> {
    const html = await this.fetcher.text(ctx, url);

    if (html.includes('This video can be watched as embed only')) {
      return await this.extractInternal(ctx, new URL(`/e${url.pathname}`, url.origin), countryCode);
    }

    if (/'The file was deleted|The file expired/.test(html)) {
      throw new NotFoundError();
    }

    const heightAndSizeMatch = html.match(/\d{3,}x(\d{3,}), ([\d.]+ ?[GM]B)/);

    const $ = cheerio.load(html);
    const title = $('.download__title').text().trim();

    return [
      {
        url: extractUrlFromPacked(html, [/sources:\[{file:"(.*?)"/]),
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${countryCode}`,
        ttl: this.ttl,
        meta: {
          countryCode,
          title,
          ...(heightAndSizeMatch && {
            bytes: bytes.parse(heightAndSizeMatch[2] as string) as number,
            height: parseInt(heightAndSizeMatch[1] as string) as number,
          }),
        },
      },
    ];
  };
}
