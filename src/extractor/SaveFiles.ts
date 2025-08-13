import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, CountryCode, Format, UrlResult } from '../types';
import { Fetcher } from '../utils';
import { Extractor } from './Extractor';

export class SaveFiles extends Extractor {
  public readonly id = 'savefiles';

  public readonly label = 'SaveFiles';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/savefiles|streamhls/);
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace('/e/', '/'));
  }

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> {
    const html = await this.fetcher.text(ctx, url);

    if (/File was locked by administrator/.test(html)) {
      throw new NotFoundError();
    }

    const fileMatch = html.match(/file:"(.*?)"/) as string[];
    const sizeMatch = html.match(/\[\d{3,}x(\d{3,})/) as string[];

    const $ = cheerio.load(html);
    const title = $('.download-title').text().trim();

    return [
      {
        url: new URL(fileMatch[1] as string),
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${countryCode}`,
        ttl: this.ttl,
        meta: {
          countryCodes: [countryCode],
          title,
          height: parseInt(sizeMatch[1] as string),
        },
      },
    ];
  };
}
