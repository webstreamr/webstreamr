import * as cheerio from 'cheerio';
import { Handler } from './types';
import { Fetcher, parseImdbId } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context, CountryCode } from '../types';

export class MostraGuarda implements Handler {
  readonly id = 'mostraguarda';

  readonly label = 'MostraGuarda';

  readonly contentTypes = ['movie'];

  readonly countryCodes: CountryCode[] = ['it'];

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

    const html = await this.fetcher.text(ctx, new URL(`https://mostraguarda.stream/movie/${parseImdbId(id).id}`));

    const $ = cheerio.load(html);

    return Promise.all(
      $('[data-link!=""]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(url => !url.host.match(/mostraguarda/))
        .map(url => this.extractorRegistry.handle(ctx, url, { countryCode: 'it' })),
    );
  };
}
