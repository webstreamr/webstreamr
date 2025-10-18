import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, getTmdbNameAndYear, Id, TmdbId } from '../utils';
import { Source, SourceResult } from './Source';

interface DooplayerResponse {
  embed_url: string | null;
  type: string | false;
}

interface FilmaonPlayerOption {
  post: number;
  type: string;
  nume: number;
}

export class Filmaon extends Source {
  public readonly id = 'filmaon';
  public readonly label = 'Filmaon';
  public readonly contentTypes: ContentType[] = ['movie', 'series'];
  public readonly countryCodes: CountryCode[] = [CountryCode.al];
  public readonly baseUrl = 'https://www.filmaon.bz';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();
    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: ContentType, id: Id): Promise<SourceResult[]> {
    // Resolve TMDb ID
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    // Fetch the main page URL
    let pageUrl = await this.fetchPageUrl(ctx, tmdbId);
    if (!pageUrl) return [];

    // If series, fetch specific episode
    if (tmdbId.season && tmdbId.episode) {
      pageUrl = await this.fetchEpisodeUrl(ctx, pageUrl, tmdbId);
      if (!pageUrl) return [];
    }

    // Fetch HTML of the page
    const pageHtml = await this.fetcher.text(ctx, pageUrl);
    const $ = cheerio.load(pageHtml);
    const title = $('title').first().text().trim();

    // Extract all DooPlay player options
    const options: FilmaonPlayerOption[] = $('.dooplay_player_option:not(#player-option-trailer)')
      .map((_i, el) => ({
        post: parseInt($(el).attr('data-post')!),
        type: $(el).attr('data-type')!,
        nume: parseInt($(el).attr('data-nume')!),
      }))
      .get();

    // Fetch embed URLs
    const results = await Promise.all(
      options.map(async (opt) => {
        const ajaxUrl = new URL('/wp-admin/admin-ajax.php', this.baseUrl);

        const dooplayerResponse = (await this.fetcher.json(
          ctx,
          ajaxUrl,
          {
            method: 'POST',
            headers: {
              Referer: pageUrl.href,
              'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: new URLSearchParams({
              action: 'doo_player_ajax',
              post: opt.post.toString(),
              nume: opt.nume.toString(),
              type: opt.type,
            }).toString(),
          },
        )) as DooplayerResponse;

        if (!dooplayerResponse?.embed_url) return null;

        return {
          url: new URL(dooplayerResponse.embed_url),
          meta: {
            countryCodes: [CountryCode.al],
            referer: pageUrl.href,
            title,
          },
        } as SourceResult;
      }),
    );

    return results.filter(Boolean) as SourceResult[];
  }

  // --- fetch movie/series page URL with fallback ---
  private async fetchPageUrl(ctx: Context, tmdbId: TmdbId): Promise<URL | undefined> {
    const [name, year] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId);

    const slugify = (str: string) =>
      str
        .toLowerCase()
        .replace(/[:!,.']/g, '') // remove special chars
        .replace(/\s+/g, '-')    // spaces to dashes
        .replace(/--+/g, '-')    // multiple dashes to single
        .trim();

    // --- 1️⃣ Try search with year ---
    let searchUrl = new URL(`/?s=${encodeURIComponent(`${name.replace(':', '')} ${year}`)}`, this.baseUrl);
    let html = await this.fetcher.text(ctx, searchUrl);
    let $ = cheerio.load(html);

    let movieLink = $('.result-item .title a')
      .map((_i, el) => new URL($(el).attr('href')!, this.baseUrl))
      .get(0);

    // --- 2️⃣ If not found, try search without year ---
    if (!movieLink) {
      searchUrl = new URL(`/?s=${encodeURIComponent(name.replace(':', ''))}`, this.baseUrl);
      html = await this.fetcher.text(ctx, searchUrl);
      $ = cheerio.load(html);

      movieLink = $('.result-item .title a')
        .map((_i, el) => new URL($(el).attr('href')!, this.baseUrl))
        .get(0);
    }

    // --- 3️⃣ If still not found, build URL directly ---
    if (!movieLink) {
      const slug = slugify(name);
      const path = tmdbId.season ? `seriale/${slug}/` : `filma/${slug}/`;
      movieLink = new URL(path, this.baseUrl);
    }

    return movieLink;
  }

  // --- fetch specific episode URL for series ---
  private async fetchEpisodeUrl(ctx: Context, pageUrl: URL, tmdbId: TmdbId): Promise<URL | undefined> {
    const html = await this.fetcher.text(ctx, pageUrl);
    const $ = cheerio.load(html);

    // Match href containing season and episode number, e.g., "1x2"
    return $(`.episodiotitle a[href*="${tmdbId.season}x${tmdbId.episode}"]`)
      .map((_i, el) => new URL($(el).attr('href')!, this.baseUrl))
      .get(0);
  }
}
