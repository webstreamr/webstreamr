import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { Context, Format, Meta, UrlResult } from '../types';
import { Extractor } from './Extractor';

export class HubCloud extends Extractor {
  public readonly id = 'hubcloud';

  public readonly label = 'HubCloud';

  public override readonly ttl: number = 259200000; // 3d

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/hubcloud/);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const redirectHtml = await this.fetcher.text(ctx, url, { headers });
    const redirectUrlMatch = redirectHtml.match(/var url ?= ?'(.*?)'/) as string[];

    const linksHtml = await this.fetcher.text(ctx, new URL(redirectUrlMatch[1] as string), { headers: { Referer: url.href } });
    const $ = cheerio.load(linksHtml);

    return Promise.all([
      ...$('a')
        .filter((_i, el) => {
          const text = $(el).text();

          return text.includes('FSL') && !text.includes('FSLv2');
        })
        .map((_i, el) => {
          const url = new URL($(el).attr('href') as string);
          return {
            url,
            format: Format.unknown,
            label: `${this.label} (FSL)`,
            ttl: this.ttl,
            meta: {
              ...meta,
              bytes: bytes.parse($('#size').text()) as number,
              extractorId: `${this.id}_fsl`,
              title: $('title').text().trim(),
            },
          };
        }).toArray(),
      ...$('a')
        .filter((_i, el) => $(el).text().includes('PixelServer'))
        .map((_i, el) => {
          const url = new URL(($(el).attr('href') as string).replace('/u/', '/api/file/'));
          return {
            url,
            format: Format.unknown,
            label: `${this.label} (PixelServer)`,
            ttl: this.ttl,
            meta: {
              ...meta,
              bytes: bytes.parse($('#size').text()) as number,
              extractorId: `${this.id}_pixelserver`,
              title: $('title').text().trim(),
            },
          };
        }).toArray(),
    ]);
  };
}
