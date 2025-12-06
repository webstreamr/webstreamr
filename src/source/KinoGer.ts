import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, getTmdbNameAndYear, Id } from '../utils';
import { Source, SourceResult } from './Source';

export class KinoGer extends Source {
  public readonly id = 'kinoger';

  public readonly label = 'KinoGer';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.de];

  public readonly baseUrl = 'https://kinoger.com';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const [name, year] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId, 'de');

    const pageUrl = await this.fetchPageUrl(ctx, name, year);
    if (!pageUrl) {
      return [];
    }

    const title = tmdbId.season ? `${name} ${tmdbId.season}x${tmdbId.episode}` : `${name} (${year})`;
    const seasonIndex = (tmdbId.season ?? 1) - 1;
    const episodeIndex = (tmdbId.episode ?? 1) - 1;

    const html = await this.fetcher.text(ctx, pageUrl);

    return Array.from(html.matchAll(/\.show\(.*/g))
      .map(showJsMatch => this.findEpisodeUrlInShowJs(showJsMatch[0], seasonIndex, episodeIndex))
      .filter((url): url is URL => url !== undefined && !['kinoger.be', 'kinoger.ru'].includes(url.host))
      .map(url => ({ url, meta: { countryCodes: [CountryCode.de], referer: pageUrl.href, title } }));
  };

  private readonly findEpisodeUrlInShowJs = (showJs: string, seasonIndex: number, episodeIndex: number): URL | undefined => {
    let episodeUrl: URL | undefined;

    showJs.matchAll(/\[(.*?)]/g).forEach((urlsMatch, season) => {
      if (season !== seasonIndex || !urlsMatch[1]) {
        return;
      }

      const urlMatch = (urlsMatch[1].split(',')[episodeIndex] ?? '').match(/https?:\/\/[^\s'"<>]+/);
      if (!urlMatch || urlMatch[0].includes('p2pplay.pro')) {
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
}
