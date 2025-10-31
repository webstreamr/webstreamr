import * as cheerio from 'cheerio';
import { Context, Format, Meta, UrlResult } from '../types';
import { extractUrlFromPacked, guessHeightFromPlaylist } from '../utils';
import { Extractor } from './Extractor';

export class Vidora extends Extractor {
  public readonly id = 'vidora';

  public readonly label = 'Vidora';

  public override readonly ttl: number = 10800000; // 3h TODO: verify how long we can cache

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/vidora/);
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace('/embed/', '/'));
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const html = await this.fetcher.text(ctx, url);

    const $ = cheerio.load(html);
    const title = $('title').text().trim().replace(/^Watch /, '').trim();

    const m3u8Url = extractUrlFromPacked(html, [/file: ?"(.*?)"/]);
    const headers = { Origin: url.origin };

    return [
      {
        url: m3u8Url,
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          height: await guessHeightFromPlaylist(ctx, this.fetcher, m3u8Url, url, { headers }),
          title,
        },
        requestHeaders: headers,
      },
    ];
  };
}
