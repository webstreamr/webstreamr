import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, getTmdbNameAndYear, Id, TmdbId } from '../utils';
import { Source, SourceResult } from './types';

export class HomeCine implements Source {
  public readonly id = 'homecine';

  public readonly label = 'HomeCine';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.es, CountryCode.mx];

  public readonly baseUrl = 'https://www3.homecine.to';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  public async handle(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const [name, year] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId, 'es');

    const pageUrl = await this.fetchPageUrl(ctx, name, year, tmdbId);
    if (!pageUrl) {
      return [];
    }

    const pageHtml = await this.fetcher.text(ctx, pageUrl);

    let linksHtml = pageHtml;
    if (tmdbId.season) {
      const episodeUrl = await this.fetchEpisodeUrl(pageHtml, tmdbId);
      if (!episodeUrl) {
        return [];
      }

      linksHtml = await this.fetcher.text(ctx, episodeUrl);
    }

    const title = tmdbId.season ? `${name} ${tmdbId.season}x${tmdbId.episode}` : `${name} (${year})`;

    const $ = cheerio.load(linksHtml);

    return $('.les-content a')
      .map((_i, el) => {
        let countryCode: CountryCode;
        if ($(el).text().toLowerCase().includes('latino') && CountryCode.mx in ctx.config) {
          countryCode = CountryCode.mx;
        } else if ($(el).text().toLowerCase().includes('castellano') && CountryCode.es in ctx.config) {
          countryCode = CountryCode.es;
        } else {
          return [];
        }

        return { countryCode, title, url: new URL($('iframe', $(el).attr('href')).attr('src') as string) };
      }).toArray();
  };

  private readonly fetchPageUrl = async (ctx: Context, keyword: string, year: number, tmdbId: TmdbId): Promise<URL | undefined> => {
    const searchUrl = new URL(`/?s=${encodeURIComponent(keyword)}`, this.baseUrl);

    const html = await this.fetcher.text(ctx, searchUrl);

    const $ = cheerio.load(html);

    const urls = $(`a[oldtitle="${keyword} (${year})"], a[oldtitle="${keyword}"]`)
      .filter((_i, el) => $(el).siblings('#hidden_tip').find(`a[href$="release-year/${year}"]`).length !== 0)
      .map((_i, el) => new URL($(el).attr('href') as string))
      .toArray()
      .filter(url => tmdbId.season ? url.href.includes('/series/') : !url.href.includes('/series/'));

    return urls[0];
  };

  private readonly fetchEpisodeUrl = async (pageHtml: string, tmdbId: TmdbId): Promise<URL | undefined> => {
    const $ = cheerio.load(pageHtml);

    const urls = $('#seasons a')
      .map((_i, el) => new URL($(el).attr('href') as string))
      .toArray()
      .filter(url => url.href.endsWith(`-temporada-${tmdbId.season}-capitulo-${tmdbId.episode}`));

    return urls[0];
  };
}
