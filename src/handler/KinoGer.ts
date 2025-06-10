import { ContentType } from 'stremio-addon-sdk';
import * as cheerio from 'cheerio';
import { Handler } from './types';
import { Fetcher, getTmdbId, getTmdbMovieDetails, getTmdbTvDetails, Id, TmdbId } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context, CountryCode } from '../types';

export class KinoGer implements Handler {
  readonly id = 'kinoger';

  readonly label = 'KinoGer';

  readonly contentTypes: ContentType[] = ['movie', 'series'];

  readonly countryCodes: CountryCode[] = ['de'];

  private readonly baseUrl = 'https://kinoger.com';

  private readonly fetcher: Fetcher;
  private readonly extractorRegistry: ExtractorRegistry;

  constructor(fetcher: Fetcher, extractorRegistry: ExtractorRegistry) {
    this.fetcher = fetcher;
    this.extractorRegistry = extractorRegistry;
  }

  readonly handle = async (ctx: Context, _type: string, id: Id) => {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const [keyword, year] = await this.getKeywordAndYear(ctx, tmdbId);

    const pageUrl = await this.fetchPageUrl(ctx, keyword, year);
    if (!pageUrl) {
      return [];
    }

    const html = await this.fetcher.text(ctx, pageUrl);

    const fsstJs = html.match(/fsst\.show\(.*/);
    if (!fsstJs) {
      return [];
    }

    const seasonIndex = (tmdbId.season ?? 1) - 1;
    const episodeIndex = (tmdbId.episode ?? 1) - 1;

    const episodeUrl = this.findEpisodeUrlInShowJs(fsstJs[0], seasonIndex, episodeIndex);
    if (!episodeUrl) {
      return [];
    }

    const title = tmdbId.season ? `${keyword} ${tmdbId.season}x${tmdbId.episode}` : `${keyword} (${year})`;

    return [
      await this.extractorRegistry.handle({ ...ctx, referer: pageUrl }, episodeUrl, { countryCode: 'de', title }),
    ];
  };

  private readonly findEpisodeUrlInShowJs = (showJs: string, seasonIndex: number, episodeIndex: number): URL | undefined => {
    let episodeUrl: URL | undefined;

    showJs.matchAll(/\[(.*?)]/g).forEach((urlsMatch, season) => {
      if (season !== seasonIndex || !urlsMatch[1]) {
        return;
      }

      const url = urlsMatch[1].split(',')[episodeIndex];
      if (!url) {
        return;
      }

      episodeUrl = new URL(url.replaceAll('[', '').replaceAll('\'', '').trim());
    });

    return episodeUrl;
  };

  private readonly fetchPageUrl = async (ctx: Context, keyword: string, year: number): Promise<URL | undefined> => {
    const searchUrl = new URL(`/?do=search&subaction=search&titleonly=3&story=${encodeURIComponent(keyword)}&x=0&y=0&submit=submit`, this.baseUrl);

    const html = await this.fetcher.text(ctx, searchUrl);

    const $ = cheerio.load(html);

    return $(`.title a:contains("${year}")`)
      .map((_i, el) => new URL($(el).attr('href') as string, this.baseUrl))
      .get(0);
  };

  private readonly getKeywordAndYear = async (ctx: Context, tmdbId: TmdbId): Promise<[string, number]> => {
    if (tmdbId.season) {
      const tmdbDetails = await getTmdbTvDetails(ctx, this.fetcher, tmdbId, 'de');

      return [tmdbDetails.name, (new Date(tmdbDetails.first_air_date)).getFullYear()];
    }

    const tmdbDetails = await getTmdbMovieDetails(ctx, this.fetcher, tmdbId, 'de');

    return [tmdbDetails.title, (new Date(tmdbDetails.release_date)).getFullYear()];
  };
}
