import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, getTmdbNameAndYear, Id, TmdbId } from '../utils';
import { Source, SourceResult } from './Source';

interface DooplayerResponse {
  embed_url: string | null;
  type: string | false;
}

export class Kokoshka extends Source {
  public readonly id = 'kokoshka';
  public readonly label = 'Kokoshka';
  public readonly contentTypes: ContentType[] = ['movie', 'series'];
  public readonly countryCodes: CountryCode[] = [CountryCode.al];
  public readonly baseUrl = 'https://kokoshka.digital';
  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();
    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    // --- Get titles in different languages ---
    const [name, year, originalName] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId, 'en'); // English
    const [alName] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId, 'sq'); // Albanian

    let pageUrl: URL | undefined;

    // Try titles in order: English → original → Albanian
    const titlesToTry = [name, originalName, alName].filter(Boolean) as string[];
    for (const title of titlesToTry) {
      pageUrl = await this.fetchPageUrl(ctx, title, tmdbId, year);
      if (pageUrl) break;
    }
    if (!pageUrl) return [];

    // --- If series, fetch episode page ---
    if (tmdbId.season) {
      pageUrl = await this.fetchEpisodeUrl(ctx, pageUrl, tmdbId);
      if (!pageUrl) return [];
    }

    const pageHtml = await this.fetcher.text(ctx, pageUrl);
    const $ = cheerio.load(pageHtml);
    const title = $('title').first().text().trim();

    // --- Extract Dooplayer embeds ---
    return Promise.all(
      $('.dooplay_player_option:not(#player-option-trailer)')
        .map(async (_i, el) => {
          const post = parseInt($(el).attr('data-post') as string);
          const type = $(el).attr('data-type') as string;
          const nume = parseInt($(el).attr('data-nume') as string);

          const dooplayerUrl = new URL(`/wp-json/dooplayer/v2/${post}/${type}/${nume}`, this.baseUrl);
          const dooplayerResponse = await this.fetcher.json(ctx, dooplayerUrl, { headers: { Referer: pageUrl!.href } }) as DooplayerResponse;

          return {
            url: new URL(dooplayerResponse.embed_url as string),
            meta: {
              countryCodes: [CountryCode.al],
              referer: pageUrl!.href,
              title,
            },
          };
        })
        .toArray(),
    );
  }

  private readonly fetchPageUrl = async (ctx: Context, title: string, tmdbId: TmdbId, year: number): Promise<URL | undefined> => {
    const searchUrl = new URL(`/?s=${encodeURIComponent(`${title.replace(':', '')} ${year}`)}`, this.baseUrl);
    const html = await this.fetcher.text(ctx, searchUrl);
    const $ = cheerio.load(html);

    return $(`.result-item:has(${tmdbId.season ? '.tvshows' : '.movies'}) a`)
      .map((_i, el) => new URL($(el).attr('href') as string, this.baseUrl))
      .get(0);
  };

  private async fetchEpisodeUrl(ctx: Context, pageUrl: URL, tmdbId: TmdbId): Promise<URL | undefined> {
    const html = await this.fetcher.text(ctx, pageUrl);
    const $ = cheerio.load(html);

    return $(`.episodiotitle a[href*="${tmdbId.season}x${tmdbId.episode}"]`)
      .map((_i, el) => new URL($(el).attr('href') as string, this.baseUrl))
      .get(0);
  }
}