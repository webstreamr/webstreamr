import { ContentType } from 'stremio-addon-sdk';
import * as cheerio from 'cheerio';
import { Source, SourceResult } from './types';
import { Fetcher, getImdbId, Id } from '../utils';
import { Context, CountryCode } from '../types';

export class MostraGuarda implements Source {
  readonly id = 'mostraguarda';

  readonly label = 'MostraGuarda';

  readonly contentTypes: ContentType[] = ['movie'];

  readonly countryCodes: CountryCode[] = [CountryCode.it];

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly handle = async (ctx: Context, _type: string, id: Id): Promise<SourceResult[]> => {
    const imdbId = await getImdbId(ctx, this.fetcher, id);

    const pageUrl = new URL(`https://mostraguarda.stream/movie/${imdbId.id}`);
    const html = await this.fetcher.text(ctx, pageUrl);

    const $ = cheerio.load(html);

    return Promise.all(
      $('[data-link!=""]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(url => !url.host.match(/mostraguarda/))
        .map(url => ({ countryCode: CountryCode.it, referer: pageUrl, url })),
    );
  };
}
