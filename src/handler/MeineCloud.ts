import * as cheerio from 'cheerio';
import { Handler } from './types';
import { Fetcher, fulfillAllPromises, parseImdbId } from '../utils';
import { EmbedExtractors } from '../embed-extractor';
import { Context } from '../types';

export class MeineCloud implements Handler {
  readonly id = 'meinecloud';

  readonly label = 'MeineCloud';

  readonly contentTypes = ['movie'];

  readonly languages = ['de'];

  private readonly fetcher: Fetcher;
  private readonly embedExtractors: EmbedExtractors;

  constructor(fetcher: Fetcher, embedExtractors: EmbedExtractors) {
    this.fetcher = fetcher;
    this.embedExtractors = embedExtractors;
  }

  readonly handle = async (ctx: Context, id: string) => {
    if (!id.startsWith('tt')) {
      return Promise.resolve([]);
    }

    const html = await this.fetcher.text(ctx, `https://meinecloud.click/movie/${parseImdbId(id).id}`);

    const $ = cheerio.load(html);

    return fulfillAllPromises(
      $('[data-link!=""]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(embedUrl => embedUrl.host.match(/(dropload|supervideo)/))
        .map(embedUrl => this.embedExtractors.handle(ctx, embedUrl, 'de')),
    );
  };
}
