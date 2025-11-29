import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, Id, TmdbId } from '../utils';
import { Source, SourceResult } from './Source';

export class CineHDPlus extends Source {
  public readonly id = 'cinehdplus';

  public readonly label = 'CineHDPlus';

  public readonly contentTypes: ContentType[] = ['series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.es, CountryCode.mx];

  public readonly baseUrl = 'https://cinehdplus.gratis';

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

    const countryCodes = [($('.details__langs').html() as string).includes('Latino') ? CountryCode.mx : CountryCode.es];

    const title = `${($('meta[property="og:title"]').attr('content') as string).trim()} S${tmdbId.season} E${tmdbId.episode}`;

    return Promise.all(
      $(`[data-num="${tmdbId.season}x${tmdbId.episode}"]`)
        .siblings('.mirrors')
        .children('[data-link]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(url => !url.host.match(/cinehdplus/))
        .map(url => ({ url, meta: { countryCodes, referer: seriesPageUrl.href, title } })),
    );
  };

  private fetchSeriesPageUrl = async (ctx: Context, tmdbId: TmdbId): Promise<URL | undefined> => {
    const html = await this.fetcher.text(ctx, new URL(`/series/?story=${tmdbId.id}&do=search&subaction=search`, this.baseUrl));

    const $ = cheerio.load(html);

    const url = $('.card__title a[href]:first')
      .map((_i, el) => $(el).attr('href'))
      .get(0);

    return url !== undefined ? new URL(url) : url;
  };
}
