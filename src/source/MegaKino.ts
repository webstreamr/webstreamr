import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getImdbId, Id, ImdbId } from '../utils';
import { Source, SourceResult } from './Source';

export class MegaKino extends Source {
  public readonly id = 'megakino';

  public readonly label = 'MegaKino';

  public readonly contentTypes: ContentType[] = ['movie'];

  public readonly countryCodes: CountryCode[] = [CountryCode.de];

  public readonly baseUrl = 'https://megakino.si';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const imdbId = await getImdbId(ctx, this.fetcher, id);

    const pageUrl = await this.fetchPageUrl(ctx, imdbId);
    if (!pageUrl) {
      return [];
    }

    const html = await this.fetcher.text(ctx, pageUrl);

    const $ = cheerio.load(html);

    const title = $('title').text().trim();

    return Promise.all(
      $(`.video-inside iframe`)
        .map((_i, el) => new URL(($(el).attr('data-src') ?? $(el).attr('src')) as string))
        .toArray()
        .map(url => ({ url, meta: { countryCodes: [CountryCode.de], referer: pageUrl.href, title } })),
    );
  };

  private fetchPageUrl = async (ctx: Context, imdbId: ImdbId): Promise<URL | undefined> => {
    const html = await this.fetcher.text(ctx, new URL(`/?do=search&subaction=search&story=${imdbId.id}`, this.baseUrl));

    const $ = cheerio.load(html);

    const url = $('#dle-content a[href].poster:first')
      .map((_i, el) => $(el).attr('href'))
      .get(0);

    return url !== undefined ? new URL(url) : url;
  };
}
