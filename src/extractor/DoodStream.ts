import bytes from 'bytes';
import * as cheerio from 'cheerio';
import randomstring from 'randomstring';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import { Extractor } from './Extractor';

export class DoodStream extends Extractor {
  public readonly id = 'doodstream';

  public readonly label = 'DoodStream';

  public override readonly ttl: number = 21600000; // 6h

  /** @see https://github.com/Gujal00/ResolveURL/blob/master/script.module.resolveurl/lib/resolveurl/plugins/doodstream.py */
  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/dood|do[0-9]go|doood|dooood|ds2play|ds2video|dsvplay|d0o0d|do0od|d0000d|d000d|myvidplay|vidply|all3do|doply|vide0|vvide0|d-s/);
  };

  public override normalize(url: URL): URL {
    const videoId = url.pathname.split('/').at(-1) as string;

    return new URL(`http://dood.to/e/${videoId}`);
  };

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const html = await this.fetcher.text(ctx, url, { headers });

    const passMd5Match = html.match(/\/pass_md5\/[\w-]+\/([\w-]+)/);
    if (!passMd5Match) {
      throw new NotFoundError();
    }

    const token = passMd5Match[1] as string;

    const baseUrl = await this.fetcher.text(ctx, new URL(passMd5Match[0], url.origin), { headers: { Referer: url.href } });

    const $ = cheerio.load(html);
    const title = $('title').text().trim().replace(/ - DoodStream$/, '').trim();

    const downloadHtml = await this.fetcher.text(ctx, new URL(url.href.replace('/e/', '/d/')));
    const sizeMatch = downloadHtml.match(/([\d.]+ ?[GM]B)/);

    let mp4Url: URL;
    if (baseUrl.includes('cloudflarestorage')) {
      mp4Url = new URL(baseUrl);
    } else {
      mp4Url = new URL(`${baseUrl}${randomstring.generate(10)}?token=${token}&expiry=${Date.now()}`);
    }

    return [
      {
        url: mp4Url,
        format: Format.mp4,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          title,
          ...(sizeMatch && { bytes: bytes.parse(sizeMatch[1] as string) as number }),
        },
        requestHeaders: {
          Referer: url.origin,
        },
      },
    ];
  };
}
