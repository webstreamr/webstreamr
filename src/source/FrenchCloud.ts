import { ContentType } from 'stremio-addon-sdk';
import * as cheerio from 'cheerio';
import { Source, SourceResult } from './types';
import { Fetcher, getImdbId, Id } from '../utils';
import { Context, CountryCode } from '../types';

export class FrenchCloud implements Source {
  public readonly id = 'frenchcloud';

  public readonly label = 'FrenchCloud';

  public readonly contentTypes: ContentType[] = ['movie'];

  public readonly countryCodes: CountryCode[] = [CountryCode.fr];

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  public readonly handle = async (ctx: Context, _type: string, id: Id): Promise<SourceResult[]> => {
    const imdbId = await getImdbId(ctx, this.fetcher, id);

    const pageUrl = new URL(`https://frenchcloud.cam/movie/${imdbId.id}`);
    const html = await this.fetcher.text(ctx, pageUrl);

    const $ = cheerio.load(html);

    return Promise.all(
      $('[data-link!=""]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(url => !url.host.match(/frenchcloud/))
        .map(url => ({ countryCode: CountryCode.fr, referer: pageUrl, url })),
    );
  };
}
