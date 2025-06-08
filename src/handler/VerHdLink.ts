import { ContentType } from 'stremio-addon-sdk';
import * as cheerio from 'cheerio';
import { Handler } from './types';
import { Fetcher, parseImdbId } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context, CountryCode } from '../types';

export class VerHdLink implements Handler {
  readonly id = 'verhdlink';

  readonly label = 'VerHdLink';

  readonly contentTypes: ContentType[] = ['movie'];

  readonly countryCodes: CountryCode[] = ['es', 'mx'];

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

    const pageUrl = new URL(`https://verhdlink.cam/movie/${parseImdbId(id).id}`);
    const html = await this.fetcher.text(ctx, pageUrl);

    const $ = cheerio.load(html);

    return Promise.all(
      $('._player-mirrors')
        .map((_i, el) => {
          let countryCode: CountryCode;
          if ($(el).hasClass('latino') && 'mx' in ctx.config) {
            countryCode = 'mx';
          } else if ($(el).hasClass('castellano') && 'es' in ctx.config) {
            countryCode = 'es';
          } else {
            return [];
          }

          return $('[data-link!=""]', el)
            .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
            .toArray()
            .filter(url => !url.host.match(/verhdlink/))
            .map(url => this.extractorRegistry.handle({ ...ctx, referer: pageUrl }, url, { countryCode }));
        }),
    );
  };
}
