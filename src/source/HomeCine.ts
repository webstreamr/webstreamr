import * as cheerio from 'cheerio';
import levenshtein from 'fast-levenshtein';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, getTmdbNameAndYear, Id, TmdbId } from '../utils';
import { Source, SourceResult } from './Source';

export class HomeCine extends Source {
  public readonly id = 'homecine';

  public readonly label = 'HomeCine';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.es, CountryCode.mx];

  public readonly baseUrl = 'https://www3.homecine.to';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const [name, year, originalName] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId, 'es');

    let pageUrl = await this.fetchPageUrl(ctx, name, tmdbId);
    if (!pageUrl) {
      pageUrl = await this.fetchPageUrl(ctx, originalName, tmdbId);
      if (!pageUrl) {
        return [];
      }
    }

    let pageHtml = await this.fetcher.text(ctx, pageUrl);

    if (tmdbId.season) {
      const pageUrl = await this.fetchEpisodeUrl(pageHtml, tmdbId);
      if (!pageUrl) {
        return [];
      }

      pageHtml = await this.fetcher.text(ctx, pageUrl);
    }

    const title = tmdbId.season ? `${name} S${tmdbId.season} E${tmdbId.episode}` : `${name} (${year})`;

    const $ = cheerio.load(pageHtml);

    return $('.les-content a')
      .map((_i, el) => {
        let countryCodes: CountryCode[];
        if ($(el).text().toLowerCase().includes('latino')) {
          countryCodes = [CountryCode.mx];
        } else if ($(el).text().toLowerCase().includes('castellano')) {
          countryCodes = [CountryCode.es];
        } else {
          return [];
        }

        return { url: new URL($('iframe', $(el).attr('href')).attr('src') as string), meta: { countryCodes, referer: pageUrl.href, title } };
      }).toArray();
  };

  private readonly fetchPageUrl = async (ctx: Context, name: string, tmdbId: TmdbId): Promise<URL | undefined> => {
    const searchUrl = new URL(`/?s=${encodeURIComponent(name)}`, this.baseUrl);

    const html = await this.fetcher.text(ctx, searchUrl);

    const $ = cheerio.load(html);

    const keywords = [...new Set([
      name,
      name.replace('-', '–'),
    ])];

    const urls: URL[] = [];

    // exact match
    keywords.map((keyword) => {
      urls.push(
        ...$(`a[oldtitle="${keyword}"]`)
          .map((_i, el) => new URL($(el).attr('href') as string))
          .toArray()
          .filter(url => tmdbId.season ? url.href.includes('/series/') : !url.href.includes('/series/')),
      );
    });

    // similar match
    keywords.map((keyword) => {
      urls.push(
        ...$(`a[oldtitle]`)
          .filter((_i, el) => levenshtein.get(($(el).attr('oldtitle') as string).trim(), keyword, { useCollator: true }) < 5)
          .map((_i, el) => new URL($(el).attr('href') as string))
          .toArray()
          .filter(url => tmdbId.season ? url.href.includes('/series/') : !url.href.includes('/series/')),
      );
    });

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
