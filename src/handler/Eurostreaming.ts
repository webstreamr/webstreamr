import { ContentType } from 'stremio-addon-sdk';
import * as cheerio from 'cheerio';
import { Handler, HandleResult } from './types';
import { Fetcher, getImdbId, Id, ImdbId } from '../utils';
import { Context, CountryCode } from '../types';

export class Eurostreaming implements Handler {
  readonly id = 'eurostreaming';

  readonly label = 'Eurostreaming';

  readonly contentTypes: ContentType[] = ['series'];

  readonly countryCodes: CountryCode[] = [CountryCode.it];

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly handle = async (ctx: Context, _type: string, id: Id): Promise<HandleResult[]> => {
    const imdbId = await getImdbId(ctx, this.fetcher, id);

    const seriesPageUrl = await this.fetchSeriesPageUrl(ctx, imdbId);
    if (!seriesPageUrl) {
      return [];
    }

    const html = await this.fetcher.text(ctx, seriesPageUrl);

    const $ = cheerio.load(html);

    const mainDataLinkElements = $(`[data-num="${imdbId.season}x${imdbId.episode}"][data-link!="#"]`);
    const mirrorDataLinkElements = $(`[data-num="${imdbId.season}x${imdbId.episode}"]`)
      .siblings('.mirrors')
      .children('[data-link!="#"]');

    const title = $('meta[property="og:title"]').attr('content') as string;

    return Promise.all(mainDataLinkElements
      .add(mirrorDataLinkElements)
      .map((_i, el) => new URL(($(el).attr('data-link') as string).replace(/^(https:)?\/\//, 'https://')))
      .toArray()
      .filter(url => !url.host.match(/eurostreaming/))
      .map(url => ({ countryCode: CountryCode.it, referer: seriesPageUrl, title: `${title.trim()} ${imdbId.season}x${imdbId.episode}`, url })),
    );
  };

  private fetchSeriesPageUrl = async (ctx: Context, imdbId: ImdbId): Promise<URL | undefined> => {
    const html = await this.fetcher.textPost(
      ctx,
      new URL('https://eurostreaming.my/index.php'),
      JSON.stringify({
        do: 'search',
        subaction: 'search',
        search_start: 0,
        full_search: 0,
        result_from: 1,
        story: imdbId.id,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const $ = cheerio.load(html);

    const url = $('.post-content a[href]:first')
      .map((_i, el) => $(el).attr('href'))
      .get(0);

    return url !== undefined ? new URL(url) : url;
  };
}
