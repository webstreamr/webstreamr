import { ContentType } from 'stremio-addon-sdk';
import * as cheerio from 'cheerio';
import { Source, SourceResult } from './types';
import { ImdbId, Fetcher, getImdbId, Id } from '../utils';
import { Context, CountryCode } from '../types';

export class StreamKiste implements Source {
  readonly id = 'streamkiste';

  readonly label = 'StreamKiste';

  readonly contentTypes: ContentType[] = ['series'];

  readonly countryCodes: CountryCode[] = [CountryCode.de];

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly handle = async (ctx: Context, _type: string, id: Id): Promise<SourceResult[]> => {
    const imdbId = await getImdbId(ctx, this.fetcher, id);

    const seriesPageUrl = await this.fetchSeriesPageUrl(ctx, imdbId);
    if (!seriesPageUrl) {
      return [];
    }

    const html = await this.fetcher.text(ctx, seriesPageUrl);

    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content') as string;

    return Promise.all(
      $(`[data-num="${imdbId.season}x${imdbId.episode}"]`)
        .siblings('.mirrors')
        .children('[data-link]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(url => !url.host.match(/streamkiste/))
        .map(url => ({ countryCode: CountryCode.de, referer: seriesPageUrl, title: `${title.trim()} ${imdbId.season}x${imdbId.episode}`, url })),
    );
  };

  private fetchSeriesPageUrl = async (ctx: Context, imdbId: ImdbId): Promise<URL | undefined> => {
    const html = await this.fetcher.text(ctx, new URL(`https://streamkiste.taxi/?story=${imdbId.id}&do=search&subaction=search`));

    const $ = cheerio.load(html);

    const url = $('.res_item a[href]:first')
      .map((_i, el) => $(el).attr('href'))
      .get(0);

    return url !== undefined ? new URL(url) : url;
  };
}
