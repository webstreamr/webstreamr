import * as cheerio from 'cheerio';
import randomstring from 'randomstring';
import { NotFoundError } from '../error';
import { Context, CountryCode, Format, UrlResult } from '../types';
import { Extractor } from './Extractor';

export class DoodStream extends Extractor {
  public readonly id = 'doodstream';

  public readonly label = 'DoodStream';

  /** @see https://github.com/Gujal00/ResolveURL/blob/master/script.module.resolveurl/lib/resolveurl/plugins/doodstream.py */
  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/dood|do[0-9]go|doood|dooood|ds2play|ds2video|d0o0d|do0od|d0000d|d000d|vidply|all3do|doply|vide0|vvide0|d-s/);
  };

  public override normalize(url: URL): URL {
    const videoId = url.pathname.split('/').slice(-1)[0] as string;

    return new URL(`http://dood.to/e/${videoId}`);
  };

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> {
    const html = await this.fetcher.text(ctx, url);

    const passMd5Match = html.match(/\/pass_md5\/[\w-]+\/([\w-]+)/);
    if (!passMd5Match) {
      throw new NotFoundError();
    }

    const token = passMd5Match[1] as string;

    const baseUrl = await this.fetcher.text(ctx, new URL(passMd5Match[0], url.origin));

    const $ = cheerio.load(html);
    const title = $('title').text().trim().replace(/ - DoodStream$/, '').trim();

    let mp4Url: URL;
    let bytes: number | undefined;
    if (baseUrl.includes('cloudflarestorage')) {
      mp4Url = new URL(baseUrl);
    } else {
      mp4Url = new URL(`${baseUrl}${randomstring.generate(10)}?token=${token}&expiry=${Date.now()}`);
      const mp4Head = await this.fetcher.head(ctx, mp4Url, { headers: { Referer: url.origin } });
      if (mp4Head['content-length']) {
        bytes = parseInt(mp4Head['content-length'] as string);
      }
    }

    return [
      {
        url: mp4Url,
        format: Format.mp4,
        label: this.label,
        sourceId: `${this.id}_${countryCode}`,
        ttl: this.ttl,
        meta: {
          countryCodes: [countryCode],
          title,
          ...(bytes && { bytes }),
        },
        requestHeaders: {
          Referer: url.origin,
        },
      },
    ];
  };
}
