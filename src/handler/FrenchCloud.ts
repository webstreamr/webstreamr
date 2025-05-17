import * as cheerio from 'cheerio';
import { Handler } from './types';
import { Fetcher, parseImdbId } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context } from '../types';

export class FrenchCloud implements Handler {
  readonly id = 'frenchcloud';

  readonly label = 'FrenchCloud';

  readonly contentTypes = ['movie'];

  readonly languages = ['fr'];

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

    const html = await this.fetcher.text(ctx, new URL(`https://frenchcloud.cam/movie/${parseImdbId(id).id}`));

    const $ = cheerio.load(html);

    return Promise.all(
      $('[data-link!=""]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(url => !url.host.match(/frenchcloud/))
        .map(url => this.extractorRegistry.handle(ctx, url, 'fr')),
    );
  };
}
