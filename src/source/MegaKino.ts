import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Cookie } from 'tough-cookie';
import { Context, CountryCode } from '../types';
import { Fetcher, getImdbId, Id, ImdbId } from '../utils';
import { Source, SourceResult } from './Source';

export class MegaKino extends Source {
  public readonly id = 'megakino';

  public readonly label = 'MegaKino';

  public readonly contentTypes: ContentType[] = ['movie'];

  public readonly countryCodes: CountryCode[] = [CountryCode.de];

  public readonly baseUrl = 'https://megakino.haus';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const imdbId = await getImdbId(ctx, this.fetcher, id);

    const tokenResponse = await this.fetcher.fetch(ctx, new URL('/?yg=token', this.baseUrl), { method: 'HEAD' });

    const cookie = Cookie.parse(tokenResponse.headers['set-cookie'] as string) as Cookie;
    const baseUrl = new URL('/', tokenResponse.url);

    const pageUrl = await this.fetchPageUrl(ctx, baseUrl, imdbId, cookie);
    if (!pageUrl) {
      return [];
    }

    const html = await this.fetcher.text(ctx, pageUrl, { headers: { Cookie: cookie.cookieString() } });

    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content')?.trim();

    return Promise.all(
      $(`.video-inside iframe`)
        .map((_i, el) => new URL(($(el).attr('data-src') ?? $(el).attr('src')) as string))
        .toArray()
        .map(url => ({ url, meta: { countryCodes: [CountryCode.de], referer: pageUrl.href, title } })),
    );
  };

  private fetchPageUrl = async (ctx: Context, postUrl: URL, imdbId: ImdbId, cookie: Cookie): Promise<URL | undefined> => {
    const form = new URLSearchParams();
    form.append('do', 'search');
    form.append('subaction', 'search');
    form.append('story', `${imdbId.id}`);

    const html = await this.fetcher.textPost(
      ctx,
      postUrl,
      form.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': postUrl.origin,
          'Cookie': cookie.cookieString(),
        },
      },
    );

    const $ = cheerio.load(html);

    return $('#dle-content a[href].poster:first')
      .map((_i, el) => new URL($(el).attr('href') as string))
      .get(0);
  };
}
