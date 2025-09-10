import * as cheerio from 'cheerio';
import { Context, Format, Meta, UrlResult } from '../types';
import { Extractor } from './Extractor';

export class Fsst extends Extractor {
  public readonly id = 'fsst';

  public readonly label = 'Fsst';

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/fsst/);
  };

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.origin };

    const html = await this.fetcher.text(ctx, url, { headers });

    const $ = cheerio.load(html);
    const title = $('title').text().trim();

    const filesMatch = html.match(/file:"(.*)"/) as string[];

    return (filesMatch[1] as string).split(',').map((fileString) => {
      const heightAndUrlMatch = fileString.match(/\[?([\d]*)p?]?(.*)/) as string[];
      const fileHref = heightAndUrlMatch[2] as string;
      const heightFromFileHrefMatch = fileHref.match(/([\d]+)p/) as string[];

      return {
        url: new URL(fileHref),
        format: Format.mp4,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        meta: {
          ...meta,
          height: parseInt(heightAndUrlMatch[1] || heightFromFileHrefMatch[1] as string),
          title,
        },
      };
    });
  };
}
