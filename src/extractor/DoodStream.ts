import randomstring from 'randomstring';
import * as cheerio from 'cheerio';
import { Extractor } from './types';
import { Fetcher } from '../utils';
import { Context, Meta } from '../types';
import { NotFoundError } from '../error';

export class DoodStream implements Extractor {
  readonly id = 'doodstream';

  readonly label = 'DoodStream';

  readonly ttl = 900000; // 15m

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly supports = (_ctx: Context, url: URL): boolean => null !== url.host.match(/dood|do[0-9]go/);

  readonly normalize = (url: URL): URL => {
    const videoId = url.pathname.split('/').slice(-1)[0] as string;

    return new URL(`http://dood.to/e/${videoId}`);
  };

  readonly extract = async (ctx: Context, url: URL, meta: Meta) => {
    const html = await this.fetcher.text(ctx, new URL(url));

    const passMd5Match = html.match(/\/pass_md5\/[\w-]+\/([\w-]+)/);
    if (!passMd5Match) {
      throw new NotFoundError();
    }

    const token = passMd5Match[1] as string;

    const baseUrl = await this.fetcher.text(ctx, new URL(`http://dood.to${passMd5Match[0]}`));

    const $ = cheerio.load(html);
    const title = $('title').text().trim().replace(/ - DoodStream$/, '').trim();

    const mp4Url = new URL(`${baseUrl}${randomstring.generate(10)}?token=${token}&expiry=${Date.now()}`);

    const mp4Head = await this.fetcher.head(ctx, mp4Url, { headers: { Referer: 'http://dood.to' } });

    return [
      {
        url: mp4Url,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCode.toLowerCase()}`,
        ttl: this.ttl,
        meta: {
          title,
          ...(mp4Head['content-length'] && { bytes: parseInt(mp4Head['content-length'] as string) }),
          ...meta,
        },
        requestHeaders: {
          Referer: 'http://dood.to/',
        },
      },
    ];
  };
}
