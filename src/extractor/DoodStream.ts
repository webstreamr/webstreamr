import randomstring from 'randomstring';
import * as cheerio from 'cheerio';
import { Extractor } from './Extractor';
import { Fetcher, guessFromTitle } from '../utils';
import { Context, CountryCode, UrlResult } from '../types';
import { NotFoundError } from '../error';

export class DoodStream extends Extractor {
  public readonly id = 'doodstream';

  public readonly label = 'DoodStream';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/dood|do[0-9]go|dooodster|dooood/);
  };

  public override normalize(url: URL): URL {
    const videoId = url.pathname.split('/').slice(-1)[0] as string;

    return new URL(`http://dood.to/e/${videoId}`);
  };

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> {
    const html = await this.fetcher.text(ctx, new URL(url));

    const passMd5Match = html.match(/\/pass_md5\/[\w-]+\/([\w-]+)/);
    if (!passMd5Match) {
      throw new NotFoundError();
    }

    const token = passMd5Match[1] as string;

    const baseUrl = await this.fetcher.text(ctx, new URL(`http://dood.to${passMd5Match[0]}`));

    const $ = cheerio.load(html);
    const title = $('title').text().trim().replace(/ - DoodStream$/, '').trim();
    const height = guessFromTitle(title);

    const mp4Url = new URL(`${baseUrl}${randomstring.generate(10)}?token=${token}&expiry=${Date.now()}`);

    const mp4Head = await this.fetcher.head(ctx, mp4Url, { headers: { Referer: 'http://dood.to' } });

    return [
      {
        url: mp4Url,
        label: this.label,
        sourceId: `${this.id}_${countryCode}`,
        ttl: this.ttl,
        meta: {
          countryCode,
          title,
          ...(mp4Head['content-length'] && { bytes: parseInt(mp4Head['content-length'] as string) }),
          ...(height && { height }),
        },
        requestHeaders: {
          Referer: 'http://dood.to/',
        },
      },
    ];
  };
}
