import { ContentType } from 'stremio-addon-sdk';
import * as cheerio from 'cheerio';
import { Handler } from './types';
import { Fetcher, getTmdbId, getTmdbMovieDetails, getTmdbTvDetails, Id, TmdbId } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context, CountryCode } from '../types';

export class Soaper implements Handler {
  readonly id = 'soaper';

  readonly label = 'Soaper';

  readonly contentTypes: ContentType[] = ['movie', 'series'];

  readonly countryCodes: CountryCode[] = ['en'];

  private readonly baseUrl = 'https://soaper.live';

  private readonly fetcher: Fetcher;
  private readonly extractorRegistry: ExtractorRegistry;

  constructor(fetcher: Fetcher, extractorRegistry: ExtractorRegistry) {
    this.fetcher = fetcher;
    this.extractorRegistry = extractorRegistry;
  }

  readonly handle = async (ctx: Context, _type: string, id: Id) => {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const [keyword, year, hrefPrefix] = await this.getKeywordYearAndHrefPrefix(ctx, tmdbId);

    const pageUrl = await this.fetchPageUrl(ctx, keyword, year, hrefPrefix);
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

      return [await this.extractorRegistry.handle({ ...ctx, referer: episodeUrl }, episodeUrl, { countryCode: 'en', title: `${keyword} ${tmdbId.season}x${tmdbId.episode}` })];
    }

    return [await this.extractorRegistry.handle({ ...ctx, referer: pageUrl }, pageUrl, { countryCode: 'en', title: `${keyword} (${year})` })];
  };

  private readonly fetchPageUrl = async (ctx: Context, keyword: string, year: number, hrefPrefix: string): Promise<URL | undefined> => {
    const searchUrl = new URL(`/search.html?keyword=${encodeURIComponent(keyword)}`, this.baseUrl);
    const html = await this.fetcher.text(ctx, searchUrl);

    const $ = cheerio.load(html);

    return $(`.thumbnail .img-group:has(.img-tip:contains("${year}")) a[href^="${hrefPrefix}"]`)
      .map((_i, el) => new URL($(el).attr('href') as string, this.baseUrl))
      .get(0);
  };

  private readonly getKeywordYearAndHrefPrefix = async (ctx: Context, tmdbId: TmdbId): Promise<[string, number, string]> => {
    if (tmdbId.season) {
      const tmdbDetails = await getTmdbTvDetails(ctx, this.fetcher, tmdbId);

      return [tmdbDetails.name, (new Date(tmdbDetails.first_air_date)).getFullYear(), '/tv_'];
    }

    const tmdbDetails = await getTmdbMovieDetails(ctx, this.fetcher, tmdbId);

    return [tmdbDetails.title, (new Date(tmdbDetails.release_date)).getFullYear(), '/movie_'];
  };
}
