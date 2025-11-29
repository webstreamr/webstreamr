import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, getTmdbNameAndYear, Id, TmdbId } from '../utils';
import { Source, SourceResult } from './Source';

export class Cuevana extends Source {
  public readonly id = 'cuevana';

  public readonly label = 'Cuevana';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.es, CountryCode.mx];

  public readonly baseUrl = 'https://ww1.cuevana3.is';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const [name, year] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId, 'es');

    let pageUrl = await this.fetchPageUrl(ctx, name);
    if (!pageUrl) {
      return [];
    }

    let title: string = name;

    if (tmdbId.season) {
      title += ` S${tmdbId.season} E${tmdbId.episode}`;

      pageUrl = await this.fetchEpisodeUrl(ctx, pageUrl, tmdbId);
      if (!pageUrl) {
        return [];
      }
    } else {
      title += ` (${year})`;
    }

    const html = await this.fetcher.text(ctx, pageUrl);
    const $ = cheerio.load(html);

    const urlResults = $('.open_submenu')
      .map((_i, el) => {
        const elText = $(el).text();
        if (!elText.includes('Español')) {
          return [];
        }

        if (elText.includes('Latino')) {
          return $('[data-tr], [data-video]', el)
            .map((_i, el) => ({
              url: new URL($(el).attr('data-tr') ?? $(el).attr('data-video') as string),
              meta: { countryCodes: [CountryCode.mx], referer: pageUrl.href, title },
            }))
            .toArray();
        }

        return $('[data-tr], [data-video]', el)
          .map((_i, el) => ({
            url: new URL($(el).attr('data-tr') ?? $(el).attr('data-video') as string),
            meta: { countryCodes: [CountryCode.es], referer: pageUrl.href, title },
          }))
          .toArray();
      })
      .toArray();

    return Promise.all(
      urlResults.map(async ({ url, meta }) => {
        if (!url.host.includes('cuevana3')) {
          return { url, meta };
        }

        const html = await this.fetcher.text(ctx, url, { headers: { Referer: pageUrl.origin } });

        const urlMatcher = html.match(/url ?= ?'(.*)'/) as string[];

        return { url: new URL(urlMatcher[1] as string), meta };
      }),
    );
  };

  private async fetchPageUrl(ctx: Context, keyword: string): Promise<URL | undefined> {
    const searchUrl = new URL(`/search/${encodeURIComponent(keyword)}/`, this.baseUrl);
    const html = await this.fetcher.text(ctx, searchUrl, { headers: { Referer: searchUrl.origin } });

    const $ = cheerio.load(html);

    const urlPath = $('.TPost .Title')
      .filter((_i, el) => $(el).text().trim() === keyword)
      .closest('a')
      .attr('href');

    return urlPath !== undefined ? new URL(urlPath, searchUrl.origin) : urlPath;
  };

  private async fetchEpisodeUrl(ctx: Context, pageUrl: URL, tmdbId: TmdbId): Promise<URL | undefined> {
    const html = await this.fetcher.text(ctx, pageUrl, { headers: { Referer: pageUrl.origin } });

    const $ = cheerio.load(html);

    const urlPath = $('.TPost .Year')
      .filter((_i, el) => $(el).text().trim() === `${tmdbId.season}x${tmdbId.episode}`)
      .closest('a')
      .attr('href');

    return urlPath !== undefined ? new URL(urlPath, pageUrl.origin) : urlPath;
  }
}
