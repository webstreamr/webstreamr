import { ContentType } from 'stremio-addon-sdk';
import * as cheerio from 'cheerio';
import { Handler, HandleResult } from './types';
import { Fetcher, getImdbId, Id } from '../utils';
import { Context, CountryCode } from '../types';

export class MeineCloud implements Handler {
  readonly id = 'meinecloud';

  readonly label = 'MeineCloud';

  readonly contentTypes: ContentType[] = ['movie'];

  readonly countryCodes: CountryCode[] = [CountryCode.de];

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly handle = async (ctx: Context, _type: string, id: Id): Promise<HandleResult[]> => {
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
