import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, getTmdbNameAndYear, Id } from '../utils';
import { Source, SourceResult } from './types';

export class Soaper implements Source {
  public readonly id = 'soaper';

  public readonly label = 'Soaper';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.en];

  private readonly baseUrl = 'https://soaper.live';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  public async handle(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const [name, year] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId);
    const hrefPrefix = tmdbId.season ? '/tv_' : '/movie_';

    const pageUrl = await this.fetchPageUrl(ctx, name, year, hrefPrefix);
    if (!pageUrl) {
      return [];
    }

    if (tmdbId.season) {
      const html = await this.fetcher.text(ctx, pageUrl);

      const $ = cheerio.load(html);

      const episodePageHref = $(`.alert:has(h4:contains("Season${tmdbId.season}")) a:contains("${tmdbId.episode}.")`).attr('href');
      if (!episodePageHref) {
        return [];
      }

      const episodeUrl = new URL(episodePageHref, this.baseUrl);
      const title = `${name} ${tmdbId.season}x${tmdbId.episode}`;

      return [{ countryCode: CountryCode.en, title, url: episodeUrl }];
    }

    const title = `${name} (${year})`;

    return [{ countryCode: CountryCode.en, title, url: pageUrl }];
  };

  private readonly fetchPageUrl = async (ctx: Context, keyword: string, year: number, hrefPrefix: string): Promise<URL | undefined> => {
    const searchUrl = new URL(`/search.html?keyword=${encodeURIComponent(keyword)}`, this.baseUrl);
    const html = await this.fetcher.text(ctx, searchUrl);

    const $ = cheerio.load(html);

    const exactKeyWordMatchUrl = $(`a[href^="${hrefPrefix}"]`)
      .filter((_i, el) => $(el).text().toLowerCase() === keyword.toLowerCase())
      .map((_i, el) => new URL($(el).attr('href') as string, this.baseUrl))
      .get(0);

    const yearMatchUrl = $(`.thumbnail .img-group:has(.img-tip:contains("${year}")) a[href^="${hrefPrefix}"]`)
      .map((_i, el) => new URL($(el).attr('href') as string, this.baseUrl))
      .get(0);

    return exactKeyWordMatchUrl ?? yearMatchUrl;
  };
}
