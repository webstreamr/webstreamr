import * as cheerio from 'cheerio';
import { Handler } from './types';
import { Fetcher, parseImdbId } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context } from '../types';

export class VerHdLink implements Handler {
  readonly id = 'verhdlink';

  readonly label = 'VerHdLink';

  readonly contentTypes = ['movie'];

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

    const html = await this.fetcher.text(ctx, new URL(`https://verhdlink.cam/movie/${parseImdbId(id).id}`));

    const $ = cheerio.load(html);

    return Promise.all(
      $('._player-mirrors')
        .map((_i, el) => {
          let countryCode = undefined;
          if ($(el).hasClass('latino')) {
            countryCode = 'mx';
          } else if ($(el).hasClass('castellano')) {
            countryCode = 'es';
          } else {
            return [];
          }

          return $('[data-link!=""]', el)
            .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
            .toArray()
            .filter(url => !url.host.match(/verhdlink/))
            .map(url => this.extractorRegistry.handle(ctx, url, countryCode));
        }),
    );
  };
}
