import * as cheerio from 'cheerio';
import { Handler } from './types';
import { ImdbId, parseImdbId, Fetcher } from '../utils';
import { EmbedExtractorRegistry } from '../embed-extractor';
import { Context } from '../types';

export class Eurostreaming implements Handler {
  readonly id = 'eurostreaming';

  readonly label = 'Eurostreaming';

  readonly contentTypes = ['series'];

  readonly languages = ['it'];

  private readonly fetcher: Fetcher;
  private readonly embedExtractors: EmbedExtractorRegistry;

  constructor(fetcher: Fetcher, embedExtractors: EmbedExtractorRegistry) {
    this.fetcher = fetcher;
    this.embedExtractors = embedExtractors;
  }

  readonly handle = async (ctx: Context, id: string) => {
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
        .children('[data-link!="#"]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(embedUrl => !embedUrl.host.match(/eurostreaming/))
        .map(embedUrl => this.embedExtractors.handle(ctx, embedUrl, 'it')),
    );
  };

  private fetchSeriesPageUrl = async (ctx: Context, imdbId: ImdbId): Promise<URL | undefined> => {
    const html = await this.fetcher.textPost(
      ctx,
      new URL('https://eurostreaming.my/index.php'),
      {
        do: 'search',
        subaction: 'search',
        search_start: 0,
        full_search: 0,
        result_from: 1,
        story: imdbId.id,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const $ = cheerio.load(html);

    const url = $('.post-content a[href]:first')
      .map((_i, el) => $(el).attr('href'))
      .get(0);

    return url !== undefined ? new URL(url) : url;
  };
}
