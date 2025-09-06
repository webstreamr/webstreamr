import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import { Extractor } from './Extractor';

export class SaveFiles extends Extractor {
  public readonly id = 'savefiles';

  public readonly label = 'SaveFiles';

  public override readonly ttl: number = 21600000; // 6h

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/savefiles|streamhls/);
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace('/e/', '/').replace('/d/', '/'));
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const html = await this.fetcher.text(ctx, url);

    if (/file was locked|file was deleted/i.test(html)) {
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
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          title,
          height: parseInt(sizeMatch[1] as string),
        },
      },
    ];
  };
}
