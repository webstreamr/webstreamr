import { ContentType } from 'stremio-addon-sdk';
import * as cheerio from 'cheerio';
import { Source, SourceResult } from './types';
import { Fetcher, getImdbId, Id } from '../utils';
import { Context, CountryCode } from '../types';

export class MeineCloud implements Source {
  public readonly id = 'meinecloud';

  public readonly label = 'MeineCloud';

  public readonly contentTypes: ContentType[] = ['movie'];

  public readonly countryCodes: CountryCode[] = [CountryCode.de];

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  public async handle(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const imdbId = await getImdbId(ctx, this.fetcher, id);

    const pageUrl = new URL(`https://meinecloud.click/movie/${imdbId.id}`);
    const html = await this.fetcher.text(ctx, pageUrl);

    const $ = cheerio.load(html);

    return Promise.all(
      $('[data-link!=""]')
        .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
        .toArray()
        .filter(url => !url.host.match(/meinecloud/))
        .map(url => ({ countryCode: CountryCode.de, referer: pageUrl, url })),
    );
  };
}
