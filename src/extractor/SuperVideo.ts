import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import { extractUrlFromPacked, guessHeightFromPlaylist } from '../utils';
import { Extractor } from './Extractor';

export class SuperVideo extends Extractor {
  public readonly id = 'supervideo';

  public readonly label = 'SuperVideo';

  public override readonly ttl: number = 10800000; // 3h

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/supervideo/);
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace('/e/', '/').replace('/k/', '/').replace('/embed-', '/'));
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.origin };

    const html = await this.fetcher.text(ctx, url, { headers });

    if (html.includes('This video can be watched as embed only')) {
      return await this.extractInternal(ctx, new URL(`/e${url.pathname}`, url.origin), meta);
    }

    if (/'The file was deleted|The file expired|Video is processing/.test(html)) {
      throw new NotFoundError();
    }

    const m3u8Url = extractUrlFromPacked(html, [/sources:\[{file:"(.*?)"/]);

    const heightAndSizeMatch = html.match(/\d{3,}x(\d{3,}), ([\d.]+ ?[GM]B)/);
    const size = heightAndSizeMatch ? bytes.parse(heightAndSizeMatch[2] as string) as number : undefined;
    const height = heightAndSizeMatch
      ? parseInt(heightAndSizeMatch[1] as string)
      : await guessHeightFromPlaylist(ctx, this.fetcher, m3u8Url, { headers });

    const $ = cheerio.load(html);
    const title = $('.download__title').text().trim();

    return [
      {
        url: m3u8Url,
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          title,
          ...(size && { bytes: size }),
          ...(height && { height }),
        },
      },
    ];
  };
}
