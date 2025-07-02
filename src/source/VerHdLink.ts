import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getImdbId, Id } from '../utils';
import { Source, SourceResult } from './types';

export class VerHdLink implements Source {
  public readonly id = 'verhdlink';

  public readonly label = 'VerHdLink';

  public readonly contentTypes: ContentType[] = ['movie'];

  public readonly countryCodes: CountryCode[] = [CountryCode.es, CountryCode.mx];

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  public async handle(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const imdbId = await getImdbId(ctx, this.fetcher, id);

    const pageUrl = new URL(`https://verhdlink.cam/movie/${imdbId.id}`);
    const html = await this.fetcher.text(ctx, pageUrl);

    const $ = cheerio.load(html);

    return $('._player-mirrors')
      .map((_i, el) => {
        let countryCode: CountryCode;
        if ($(el).hasClass('latino') && 'mx' in ctx.config) {
          countryCode = CountryCode.mx;
        } else if ($(el).hasClass('castellano') && 'es' in ctx.config) {
          countryCode = CountryCode.es;
        } else {
          return [];
        }

        return $('[data-link!=""]', el)
          .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
          .toArray()
          .filter(url => !url.host.match(/verhdlink/))
          .map(url => ({ countryCode, referer: pageUrl, url }));
      }).toArray();
  };
}
