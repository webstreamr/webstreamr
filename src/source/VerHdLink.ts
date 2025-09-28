import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getImdbId, Id } from '../utils';
import { Source, SourceResult } from './Source';

export class VerHdLink extends Source {
  public readonly id = 'verhdlink';

  public readonly label = 'VerHdLink';

  public readonly contentTypes: ContentType[] = ['movie'];

  public readonly countryCodes: CountryCode[] = [CountryCode.es, CountryCode.mx];

  public readonly baseUrl = 'https://verhdlink.cam';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const imdbId = await getImdbId(ctx, this.fetcher, id);

    const pageUrl = new URL(`/movie/${imdbId.id}`, this.baseUrl);
    const html = await this.fetcher.text(ctx, pageUrl);

    const $ = cheerio.load(html);

    return $('._player-mirrors')
      .map((_i, el) => {
        let countryCodes: CountryCode[];
        if ($(el).hasClass('latino')) {
          countryCodes = [CountryCode.mx];
        } else if ($(el).hasClass('castellano')) {
          countryCodes = [CountryCode.es];
        } else {
          return [];
        }

        return $('[data-link!=""]', el)
          .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
          .toArray()
          .filter(url => !url.host.match(/verhdlink/))
          .map(url => ({ url, meta: { countryCodes, referer: this.baseUrl } }));
      }).toArray();
  };
}
