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

    let pageUrl = await this.fetchPageUrl(ctx, tmdbId);
    if (!pageUrl) {
      return [];
    }

    if (tmdbId.season) {
      pageUrl = await this.fetchEpisodeUrl(ctx, pageUrl, tmdbId);
      if (!pageUrl) {
        return [];
      }
    }

    const pageHtml = await this.fetcher.text(ctx, pageUrl);

    const $ = cheerio.load(pageHtml);

    const title = $('title').first().text().trim();

    return Promise.all(
      $('.dooplay_player_option:not(#player-option-trailer)')
        .map(async (_i, el) => {
          const post = parseInt($(el).attr('data-post') as string);
          const type = $(el).attr('data-type') as string;
          const nume = parseInt($(el).attr('data-nume') as string);

          const dooplayerUrl = new URL(`/wp-json/dooplayer/v2/${post}/${type}/${nume}`, this.baseUrl);
          const dooplayerResponse = await this.fetcher.json(ctx, dooplayerUrl, { headers: { Referer: pageUrl.href } }) as DooplayerResponse;

          return {
            url: new URL(dooplayerResponse.embed_url as string),
            meta: {
              countryCodes: [CountryCode.al],
              referer: pageUrl.href,
              title,
            },
          };
        })
        .toArray(),
    );
  }

  private readonly fetchPageUrl = async (ctx: Context, tmdbId: TmdbId): Promise<URL | undefined> => {
    const [name, year] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId, 'sq');

    const searchUrl = new URL(`/?s=${encodeURIComponent(`${name.replace(':', '')} ${year}`)}`, this.baseUrl);
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
