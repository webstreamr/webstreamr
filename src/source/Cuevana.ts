import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, getTmdbMovieDetails, getTmdbTvDetails, Id, TmdbId } from '../utils';
import { Source, SourceResult } from './types';

export class Cuevana implements Source {
  public readonly id = 'cuevana';

  public readonly label = 'Cuevana';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.es, CountryCode.mx];

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  public async handle(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const name = tmdbId.season
      ? (await getTmdbTvDetails(ctx, this.fetcher, tmdbId, 'es')).name
      : (await getTmdbMovieDetails(ctx, this.fetcher, tmdbId, 'es')).title;

    const pageUrl = await this.fetchPageUrl(ctx, name);
    if (!pageUrl) {
      return [];
    }

    let title: string = name;
    let html: string;

    if (tmdbId.season) {
      title += ` ${tmdbId.season}x${tmdbId.episode}`;

      const episodeUrl = await this.fetchEpisodeUrl(ctx, pageUrl, tmdbId);
      if (!episodeUrl) {
        return [];
      }

      html = await this.fetcher.text(ctx, episodeUrl);
    } else {
      html = await this.fetcher.text(ctx, pageUrl);
    }

    const $ = cheerio.load(html);

    const urlResults = $('.open_submenu')
      .map((_i, el) => {
        const elText = $(el).text();
        if (!elText.includes('Español')) {
          return [];
        }

        const isLatino = elText.includes('Latino');

        if (isLatino && CountryCode.mx in ctx.config) {
          return $('[data-tr], [data-video]', el)
            .map((_i, el) => ({ countryCode: CountryCode.mx, title, url: new URL($(el).attr('data-tr') ?? $(el).attr('data-video') as string) }))
            .toArray();
        } else if (!isLatino && CountryCode.es in ctx.config) {
          return $('[data-tr], [data-video]', el)
            .map((_i, el) => ({ countryCode: CountryCode.es, title, url: new URL($(el).attr('data-tr') ?? $(el).attr('data-video') as string) }))
            .toArray();
        } else {
          return [];
        }
      })
      .toArray();

    return Promise.all(
      urlResults.map(async (urlResult) => {
        if (!urlResult.url.host.includes('cuevana3')) {
          return urlResult;
        }

        const html = await this.fetcher.text(ctx, urlResult.url, { headers: { Referer: pageUrl.origin } });

        const urlMatcher = html.match(/url ?= ?'(.*)'/) as string[];

        return { ...urlResult, url: new URL(urlMatcher[1] as string) };
      }),
    );
  };

  private async fetchPageUrl(ctx: Context, keyword: string): Promise<URL | undefined> {
    const searchUrl = new URL(`https://ww1.cuevana3.is/search/${encodeURIComponent(keyword)}/`);
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
