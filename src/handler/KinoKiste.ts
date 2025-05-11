import * as cheerio from 'cheerio';
import { Handler } from './types';
import { ImdbId, fulfillAllPromises, parseImdbId, Fetcher } from '../utils';
import { EmbedExtractors } from '../embed-extractor';

export class KinoKiste implements Handler {
  readonly id = 'kinokiste';

  readonly label = 'KinoKiste';

  readonly contentTypes = ['series'];

  readonly languages = ['de'];

  private readonly fetcher: Fetcher;
  private readonly embedExtractors: EmbedExtractors;

  constructor(fetcher: Fetcher, embedExtractors: EmbedExtractors) {
    this.fetcher = fetcher;
    this.embedExtractors = embedExtractors;
  }

  readonly handle = async (id: string) => {
    if (!id.startsWith('tt')) {
      return Promise.resolve([]);
    }

    const imdbId = parseImdbId(id);

    const seriesPageUrl = await this.fetchSeriesPageUrl(imdbId);
    if (!seriesPageUrl) {
      return Promise.resolve([]);
    }

    const html = await this.fetcher.text(seriesPageUrl);

    const $ = cheerio.load(html);

    return fulfillAllPromises(
      $(`[data-num="${imdbId.series}x${imdbId.episode}"]`)
        .siblings('.mirrors')
        .children('[data-link]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(embedUrl => embedUrl.host.match(/(dropload|supervideo)/))
        .map(embedUrl => this.embedExtractors.handle(embedUrl, 'de')),
    );
  };

  private fetchSeriesPageUrl = async (imdbId: ImdbId): Promise<string | undefined> => {
    const html = await this.fetcher.text(`https://kinokiste.live/serien/?do=search&subaction=search&story=${imdbId.id}`);

    const $ = cheerio.load(html);

    return $('.item-video a[href]:first')
      .map((_i, el) => $(el).attr('href'))
      .get(0);
  };
}
