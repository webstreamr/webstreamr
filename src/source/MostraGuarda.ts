import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getImdbId, Id } from '../utils';
import { Source, SourceResult } from './Source';

export class MostraGuarda extends Source {
  public readonly id = 'mostraguarda';

  public readonly label = 'MostraGuarda';

  public readonly contentTypes: ContentType[] = ['movie'];

  public readonly countryCodes: CountryCode[] = [CountryCode.it];

  public readonly baseUrl = 'https://mostraguarda.stream';

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

    return Promise.all(
      $('[data-link!=""]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(url => !url.host.match(/mostraguarda/))
        .map(url => ({ url, meta: { countryCodes: [CountryCode.it], referer: this.baseUrl } })),
    );
  };
}
