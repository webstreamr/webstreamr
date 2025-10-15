import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, Id, TmdbId } from '../utils';
import { Source, SourceResult } from './Source';

export class StreamKiste extends Source {
  public readonly id = 'streamkiste';

  public readonly label = 'StreamKiste';

  public readonly contentTypes: ContentType[] = ['series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.de];

  public readonly baseUrl = 'https://streamkiste.taxi';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const seriesPageUrl = await this.fetchSeriesPageUrl(ctx, tmdbId);
    if (!seriesPageUrl) {
      return [];
    }

    const html = await this.fetcher.text(ctx, seriesPageUrl);

    const $ = cheerio.load(html);

    const title = `${($('meta[property="og:title"]').attr('content') as string).trim()} ${tmdbId.season}x${tmdbId.episode}`;

    return Promise.all(
      $(`[data-num="${tmdbId.season}x${tmdbId.episode}"]`)
        .siblings('.mirrors')
        .children('[data-link]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(url => !url.host.match(/streamkiste/))
        .map(url => ({ url, meta: { countryCodes: [CountryCode.de], referer: seriesPageUrl.href, title } })),
    );
  };

  private fetchSeriesPageUrl = async (ctx: Context, tmdbId: TmdbId): Promise<URL | undefined> => {
    const html = await this.fetcher.text(ctx, new URL(`/?story=${tmdbId.id}&do=search&subaction=search`, this.baseUrl));

    const $ = cheerio.load(html);

    return $('.res_item a[href]:first')
      .map((_i, el) => new URL($(el).attr('href') as string))
      .get(0);
  };
}
