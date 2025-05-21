import * as cheerio from 'cheerio';
import { Handler } from './types';
import { Fetcher, ImdbId, parseImdbId } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context } from '../types';

export class CineHDPlus implements Handler {
  readonly id = 'cinehdplus';

  readonly label = 'CineHDPlus';

  readonly contentTypes = ['series'];

  readonly languages = ['es', 'mx'];

  private readonly fetcher: Fetcher;
  private readonly extractorRegistry: ExtractorRegistry;

  constructor(fetcher: Fetcher, extractorRegistry: ExtractorRegistry) {
    this.fetcher = fetcher;
    this.extractorRegistry = extractorRegistry;
  }

  readonly handle = async (ctx: Context, _type: string, id: string) => {
    if (!id.startsWith('tt')) {
      return [];
    }

    const imdbId = parseImdbId(id);

    const seriesPageUrl = await this.fetchSeriesPageUrl(ctx, imdbId);
    if (!seriesPageUrl) {
      return [];
    }

    const html = await this.fetcher.text(ctx, seriesPageUrl);

    const $ = cheerio.load(html);

    const countryCode = ($('.details__langs').html() as string).includes('Latino') ? 'mx' : 'es';
    if (!(countryCode in ctx.config)) {
      return [];
    }

    return Promise.all(
      $(`[data-num="${imdbId.series}x${imdbId.episode}"]`)
        .siblings('.mirrors')
        .children('[data-link]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(url => !url.host.match(/cinehdplus/))
        .map(url => this.extractorRegistry.handle(ctx, url, countryCode)),
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
