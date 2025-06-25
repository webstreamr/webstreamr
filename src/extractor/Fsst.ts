import * as cheerio from 'cheerio';
import { Extractor } from './Extractor';
import { Fetcher } from '../utils';
import { Context, CountryCode, Format, UrlResult } from '../types';

export class Fsst extends Extractor {
  public readonly id = 'fsst';

  public readonly label = 'Fsst';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/fsst/);
  };

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> {
    const html = await this.fetcher.text(ctx, url);

    const $ = cheerio.load(html);
    const title = $('title').text().trim();

    const filesMatch = html.match(/file:"(.*)"/) as string[];

    return (filesMatch[1] as string).split(',').map((fileString, index) => {
      const heightAndUrlMatch = fileString.match(/\[?([\d]*)p?]?(.*)/) as string[];
      const fileHref = heightAndUrlMatch[2] as string;
      const heightFromFileHrefMatch = fileHref.match(/([\d]+)p/) as string[];

      return {
        url: new URL(fileHref),
        format: Format.mp4,
        label: this.label,
        sourceId: `${this.id}_${countryCode}_${index}`,
        meta: {
          countryCodes: [countryCode],
          height: parseInt(heightAndUrlMatch[1] || heightFromFileHrefMatch[1] as string),
          title,
        },
      };
    });
  };
}
