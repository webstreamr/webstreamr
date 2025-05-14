import * as cheerio from 'cheerio';
import { Handler } from './types';
import { Fetcher, parseImdbId } from '../utils';
import { EmbedExtractorRegistry } from '../embed-extractor';
import { Context } from '../types';

export class MostraGuarda implements Handler {
  readonly id = 'mostraguarda';

  readonly label = 'MostraGuarda';

  readonly contentTypes = ['movie'];

  readonly languages = ['it'];

  private readonly fetcher: Fetcher;
  private readonly embedExtractors: EmbedExtractorRegistry;

  constructor(fetcher: Fetcher, embedExtractors: EmbedExtractorRegistry) {
    this.fetcher = fetcher;
    this.embedExtractors = embedExtractors;
  }

  readonly handle = async (ctx: Context, _type: string, id: string) => {
    if (!id.startsWith('tt')) {
      return [];
    }

    const html = await this.fetcher.text(ctx, new URL(`https://mostraguarda.stream/movie/${parseImdbId(id).id}`));

    const $ = cheerio.load(html);

    return Promise.all(
      $('[data-link!=""]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(embedUrl => !embedUrl.host.match(/mostraguarda/))
        .map(embedUrl => this.embedExtractors.handle(ctx, embedUrl, 'it')),
    );
  };
}
