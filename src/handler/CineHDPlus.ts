import { ContentType } from 'stremio-addon-sdk';
import * as cheerio from 'cheerio';
import { Handler, HandleResult } from './types';
import { Fetcher, getImdbId, Id, ImdbId } from '../utils';
import { Context, CountryCode } from '../types';

export class CineHDPlus implements Handler {
  readonly id = 'cinehdplus';

  readonly label = 'CineHDPlus';

  readonly contentTypes: ContentType[] = ['series'];

  readonly countryCodes: CountryCode[] = [CountryCode.es, CountryCode.mx];

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly handle = async (ctx: Context, _type: string, id: Id): Promise<HandleResult[]> => {
    const imdbId = await getImdbId(ctx, this.fetcher, id);

    const seriesPageUrl = await this.fetchSeriesPageUrl(ctx, imdbId);
    if (!seriesPageUrl) {
      return [];
    }

    const html = await this.fetcher.text(ctx, seriesPageUrl);

    const $ = cheerio.load(html);

    const countryCode: CountryCode = ($('.details__langs').html() as string).includes('Latino') ? CountryCode.mx : CountryCode.es;
    if (!(countryCode in ctx.config)) {
      return [];
    }

    const title = $('meta[property="og:title"]').attr('content') as string;

    return Promise.all(
      $(`[data-num="${imdbId.season}x${imdbId.episode}"]`)
        .siblings('.mirrors')
        .children('[data-link]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(url => !url.host.match(/cinehdplus/))
        .map(url => ({ countryCode, referer: seriesPageUrl, title: `${title.trim()} ${imdbId.season}x${imdbId.episode}`, url })),
    );
  };

  private fetchSeriesPageUrl = async (ctx: Context, imdbId: ImdbId): Promise<URL | undefined> => {
    const html = await this.fetcher.text(ctx, new URL(`https://cinehdplus.cam/series/?story=${imdbId.id}&do=search&subaction=search`));

    const $ = cheerio.load(html);

    const url = $('.card__title a[href]:first')
      .map((_i, el) => $(el).attr('href'))
      .get(0);

    return url !== undefined ? new URL(url) : url;
  };
}
