import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getImdbId, Id, ImdbId } from '../utils';
import { Source, SourceResult } from './types';

export class MegaKino implements Source {
  public readonly id = 'megakino';

  public readonly label = 'MegaKino';

  public readonly contentTypes: ContentType[] = ['movie'];

  public readonly countryCodes: CountryCode[] = [CountryCode.de];

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  public async handle(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
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
        .map(url => ({ countryCode: CountryCode.de, referer: pageUrl, title, url })),
    );
  };

  private fetchPageUrl = async (ctx: Context, imdbId: ImdbId): Promise<URL | undefined> => {
    const html = await this.fetcher.text(ctx, new URL(`https://megakino.si/?do=search&subaction=search&story=${imdbId.id}`));

    const $ = cheerio.load(html);

    const url = $('#dle-content a[href].poster:first')
      .map((_i, el) => $(el).attr('href'))
      .get(0);

    return url !== undefined ? new URL(url) : url;
  };
}
