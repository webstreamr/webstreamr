import * as cheerio from 'cheerio';
import { Handler } from './types';
import { ImdbId, parseImdbId, Fetcher } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context } from '../types';

export class KinoKiste implements Handler {
  readonly id = 'kinokiste';

  readonly label = 'KinoKiste';

  readonly contentTypes = ['series'];

  readonly languages = ['de'];

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

    return Promise.all(
      $(`[data-num="${imdbId.series}x${imdbId.episode}"]`)
        .siblings('.mirrors')
        .children('[data-link]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(url => !url.host.match(/kinokiste/))
        .map(url => this.extractorRegistry.handle(ctx, url, { countryCode: 'de' })),
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
