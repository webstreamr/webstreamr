import * as cheerio from 'cheerio';
import { Extractor } from './types';
import { Fetcher } from '../utils';
import { Context, CountryCode, UrlResult } from '../types';

export class Fsst implements Extractor {
  readonly id = 'fsst';

  readonly label = 'Fsst';

  readonly ttl = 900000; // 15m

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly supports = (_ctx: Context, url: URL): boolean => null !== url.host.match(/fsst/);

  readonly normalize = (url: URL): URL => url;

  readonly extract = async (ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> => {
    const html = await this.fetcher.text(ctx, url);

    const $ = cheerio.load(html);
    const title = $('title').text().trim();

    const filesMatch = html.match(/file:"(.*)"/) as string[];

    return (filesMatch[1] as string).split(',').map((fileString, index) => {
      const heightAndUrlMatch = fileString.match(/\[([\d]+)p\](.*)/) as string[];

      return {
        url: new URL(heightAndUrlMatch[2] as string),
        label: this.label,
        sourceId: `${this.id}_${countryCode}_${index}`,
        meta: {
          countryCode,
          height: parseInt(heightAndUrlMatch[1] as string),
          title,
        },
      };
    });
  };
}
