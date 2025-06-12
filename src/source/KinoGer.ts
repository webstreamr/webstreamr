import { ContentType } from 'stremio-addon-sdk';
import * as cheerio from 'cheerio';
import { Source, SourceResult } from './types';
import { Fetcher, getTmdbId, getTmdbMovieDetails, getTmdbTvDetails, Id, TmdbId } from '../utils';
import { Context, CountryCode } from '../types';

export class KinoGer implements Source {
  readonly id = 'kinoger';

  readonly label = 'KinoGer';

  readonly contentTypes: ContentType[] = ['movie', 'series'];

  readonly countryCodes: CountryCode[] = [CountryCode.de];

  private readonly baseUrl = 'https://kinoger.com';

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly handle = async (ctx: Context, _type: string, id: Id): Promise<SourceResult[]> => {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const [keyword, year] = await this.getKeywordAndYear(ctx, tmdbId);

    const pageUrl = await this.fetchPageUrl(ctx, keyword, year);
    if (!pageUrl) {
      return [];
    }

    const title = tmdbId.season ? `${keyword} ${tmdbId.season}x${tmdbId.episode}` : `${keyword} (${year})`;
    const seasonIndex = (tmdbId.season ?? 1) - 1;
    const episodeIndex = (tmdbId.episode ?? 1) - 1;

    const html = await this.fetcher.text(ctx, pageUrl);

    return Array.from(html.matchAll(/\.show\(.*/g))
      .map(showJsMatch => this.findEpisodeUrlInShowJs(showJsMatch[0], seasonIndex, episodeIndex))
      .filter((url): url is URL => url !== undefined && !['kinoger.be', 'kinoger.ru'].includes(url.host))
      .map(url => ({ countryCode: CountryCode.de, referer: pageUrl, title, url }));
  };

  private readonly findEpisodeUrlInShowJs = (showJs: string, seasonIndex: number, episodeIndex: number): URL | undefined => {
    let episodeUrl: URL | undefined;

    showJs.matchAll(/\[(.*?)]/g).forEach((urlsMatch, season) => {
      if (season !== seasonIndex || !urlsMatch[1]) {
        return;
      }

      const urlMatch = (urlsMatch[1].split(',')[episodeIndex] ?? '').match(/https?:\/\/[^\s'"<>]+/);
      if (!urlMatch) {
        return;
      }

      episodeUrl = new URL(urlMatch[0]);
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
