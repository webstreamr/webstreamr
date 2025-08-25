import bytes from 'bytes';
import * as cheerio from 'cheerio';
import randomstring from 'randomstring';
import { NotFoundError } from '../error';
import { Context, CountryCode, Format, UrlResult } from '../types';
import { Fetcher } from '../utils';
import { Extractor } from './Extractor';

export class DoodStream extends Extractor {
  public readonly id = 'doodstream';

  public readonly label = 'DoodStream';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  /** @see https://github.com/Gujal00/ResolveURL/blob/master/script.module.resolveurl/lib/resolveurl/plugins/doodstream.py */
  public supports(_ctx: Context, url: URL): boolean {
    return [
      'all3do.com',
      'd-s.io',
      'd0000d.com',
      'd000d.com',
      'd0o0d.com',
      'do0od.com',
      'do7go.com',
      'dood.cx',
      'dood.la',
      'dood.li',
      'dood.pm',
      'dood.re',
      'dood.sh',
      'dood.so',
      'dood.stream',
      'dood.to',
      'dood.watch',
      'dood.wf',
      'dood.work',
      'dood.ws',
      'dood.yt',
      'doodcdn.io',
      'doods.pro',
      'doodstream.co',
      'doodstream.com',
      'dooodster.com',
      'dooood.com',
      'doply.net',
      'ds2play.com',
      'ds2video.com',
      'vide0.net',
      'vidply.com',
      'vvide0.com',
    ].includes(url.host);
  };

  public override normalize(url: URL): URL {
    const supportedHosts = [
      'all3do.com',
      'd-s.io',
      'doodstream.com',
      'vide0.net',
      'vidply.com',
    ];
    const host = supportedHosts.includes(url.host) ? url.host : 'd-s.io';

    const videoId = url.pathname.split('/').slice(-1)[0] as string;

    return new URL(`/d/${videoId}`, `${url.protocol}//${host}`);
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
    const sizeMatch = html.match(/([\d.]+ ?[GM]B)/) as string[];

    const mp4Url = baseUrl.includes('cloudflarestorage.')
      ? new URL(baseUrl) // TODO: headers needed here? compare with resolveurl
      : new URL(`${baseUrl}${randomstring.generate(10)}?token=${token}&expiry=${Date.now()}`);

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
          bytes: bytes.parse(sizeMatch[1] as string) as number,
        },
        requestHeaders: {
          Referer: url.origin,
        },
      },
    ];
  };
}
