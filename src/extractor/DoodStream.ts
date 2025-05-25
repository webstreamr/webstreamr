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

  readonly supports = (url: URL): boolean => null !== url.host.match(/dood|do[0-9]go/);

  readonly extract = async (ctx: Context, url: URL, meta: Meta) => {
    const videoId = url.pathname.split('/').slice(-1)[0] as string;
    const normalizedUrl = new URL(`http://dood.to/e/${videoId}`);

    const html = await this.fetcher.text(ctx, new URL(normalizedUrl));

    const passMd5Match = html.match(/\/pass_md5\/[\w-]+\/([\w-]+)/);
    if (!passMd5Match) {
      throw new NotFoundError();
    }

    const token = passMd5Match[1] as string;

    const baseUrl = await this.fetcher.text(ctx, new URL(`http://dood.to${passMd5Match[0]}`));

    const $ = cheerio.load(html);
    const title = $('title').text().trim().replace(/ - DoodStream$/, '').trim();

    return {
      url: new URL(`${baseUrl}${randomstring.generate(10)}?token=${token}&expiry=${Date.now()}`),
      label: this.label,
      sourceId: `${this.id}_${meta.countryCode.toLowerCase()}`,
      meta: {
        title,
        ...meta,
      },
      requestHeaders: {
        Referer: 'http://dood.to/',
      },
    };
  };
}
