import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, getTmdbNameAndYear, Id } from '../utils';
import { Source, SourceResult } from './Source';

export class Eurostreaming extends Source {
  public readonly id = 'eurostreaming';

  public readonly label = 'Eurostreaming';

  public readonly contentTypes: ContentType[] = ['series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.it];

  public readonly baseUrl = 'https://eurostreaming.luxe';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);
    const [name] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId, 'it');

    const seriesPageUrl = await this.fetchSeriesPageUrl(ctx, name);
    if (!seriesPageUrl) {
      return [];
    }

    const html = await this.fetcher.text(ctx, seriesPageUrl);

    const $ = cheerio.load(html);

    const title = `${name} ${tmdbId.season}x${tmdbId.episode}`;

    return Promise.all(
      $(`[data-num="${tmdbId.season}x${tmdbId.episode}"]`)
        .siblings('.mirrors')
        .children('[data-link!="#"]')
        .map((_i, el) => new URL($(el).attr('data-link') as string))
        .toArray()
        .filter(url => !url.host.match(/eurostreaming/))
        .map(url => ({ url, meta: { countryCodes: [CountryCode.it], referer: seriesPageUrl.href, title } })),
    );
  };

  private fetchSeriesPageUrl = async (ctx: Context, keyword: string): Promise<URL | undefined> => {
    const postUrl = new URL('/index.php?do=search', this.baseUrl);

    const form = new URLSearchParams();
    form.append('subaction', 'search');
    form.append('story', keyword);

    const html = await this.fetcher.textPost(
      ctx,
      postUrl,
      form.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': postUrl.origin,
        },
      },
    );

    const $ = cheerio.load(html);

    const exactKeyWordMatchUrl = $(`.post-thumb a[href][title="${keyword}"]:first`)
      .map((_i, el) => new URL($(el).attr('href') as string))
      .get(0);

    const partialKeyWordMatchUrl = $(`.post-thumb a[href][title*="${keyword}"]:first`)
      .map((_i, el) => new URL($(el).attr('href') as string))
      .get(0);

    return exactKeyWordMatchUrl ?? partialKeyWordMatchUrl;
  };
}
