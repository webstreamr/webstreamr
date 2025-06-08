import { ContentType } from 'stremio-addon-sdk';
import * as cheerio from 'cheerio';
import { Handler } from './types';
import { ImdbId, Fetcher, getImdbId, Id } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context, CountryCode } from '../types';

export class KinoKiste implements Handler {
  readonly id = 'kinokiste';

  readonly label = 'KinoKiste';

  readonly contentTypes: ContentType[] = ['series'];

  readonly countryCodes: CountryCode[] = ['de'];

  private readonly fetcher: Fetcher;
  private readonly extractorRegistry: ExtractorRegistry;

  constructor(fetcher: Fetcher, extractorRegistry: ExtractorRegistry) {
    this.fetcher = fetcher;
    this.extractorRegistry = extractorRegistry;
  }

  readonly handle = async (ctx: Context, _type: string, id: Id) => {
    const imdbId = await getImdbId(ctx, this.fetcher, id);

    const seriesPageUrl = await this.fetchSeriesPageUrl(ctx, imdbId);
    if (!seriesPageUrl) {
      return [];
    }

    const html = await this.fetcher.text(ctx, seriesPageUrl);

    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content') as string;

    return Promise.all(
      $(`[data-num="${imdbId.series}x${imdbId.episode}"]`)
        .siblings('.mirrors')
        .children('[data-link]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(url => !url.host.match(/kinokiste/))
        .map(url => this.extractorRegistry.handle({ ...ctx, referer: seriesPageUrl }, url, { countryCode: 'de', title: `${title.trim()} ${imdbId.series}x${imdbId.episode}` })),
    );
  };

  private fetchSeriesPageUrl = async (ctx: Context, imdbId: ImdbId): Promise<URL | undefined> => {
    const html = await this.fetcher.text(ctx, new URL(`https://kinokiste.live/serien/?do=search&subaction=search&story=${imdbId.id}`));

    const $ = cheerio.load(html);

    const url = $('.item-video a[href]:first')
      .map((_i, el) => $(el).attr('href'))
      .get(0);

    return url !== undefined ? new URL(url) : url;
  };
}
