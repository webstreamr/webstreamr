import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { Context, Format, InternalUrlResult, Meta } from '../types';
import { findCountryCodes, findHeight } from '../utils';
import { Extractor } from './Extractor';

export class HubCloud extends Extractor {
  public readonly id = 'hubcloud';

  public readonly label = 'HubCloud';

  public override readonly ttl: number = 43200000; // 12h

  public override readonly cacheVersion = 1;

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/hubcloud/);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<InternalUrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const redirectHtml = await this.fetcher.text(ctx, url, { headers });
    const redirectUrlMatch = redirectHtml.match(/var url ?= ?'(.*?)'/) as string[];

    const linksHtml = await this.fetcher.text(ctx, new URL(redirectUrlMatch[1] as string), { headers: { Referer: url.href } });
    const $ = cheerio.load(linksHtml);

    const title = $('title').text().trim();
    const countryCodes = [...new Set([...meta.countryCodes ?? [], ...findCountryCodes(title)])];
    const height = meta.height ?? findHeight(title);

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
            meta: {
              ...meta,
              bytes: bytes.parse($('#size').text()) as number,
              extractorId: `${this.id}_fsl`,
              countryCodes,
              height,
              title,
            },
          };
        }).toArray(),
      ...$('a')
        .filter((_i, el) => {
          const text = $(el).text();

          return text.includes('FSLv2');
        })
        .map((_i, el) => {
          const url = new URL($(el).attr('href') as string);
          return {
            url,
            format: Format.unknown,
            label: `${this.label} (FSLv2)`,
            meta: {
              ...meta,
              bytes: bytes.parse($('#size').text()) as number,
              extractorId: `${this.id}_fslv2`,
              countryCodes,
              height,
              title,
            },
          };
        }).toArray(),
      ...$('a')
        .filter((_i, el) => $(el).text().includes('PixelServer'))
        .map((_i, el) => {
          const userUrl = new URL(($(el).attr('href') as string).replace('/api/file/', '/u/'));
          const url = new URL(userUrl.href.replace('/u/', '/api/file/'));
          url.searchParams.set('download', '');

          return {
            url,
            format: Format.unknown,
            label: `${this.label} (PixelServer)`,
            meta: {
              ...meta,
              bytes: bytes.parse($('#size').text()) as number,
              extractorId: `${this.id}_pixelserver`,
              countryCodes,
              height,
              title,
            },
            requestHeaders: { Referer: userUrl.href },
          };
        }).toArray(),
    ]);
  };
}
