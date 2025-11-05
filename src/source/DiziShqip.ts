import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, getTmdbNameAndYear, getTmdbTvDetails, Id, TmdbId } from '../utils';
import { Source, SourceResult } from './Source';

export class DiziShqip extends Source {
  public readonly id = 'dizishqip';
  public readonly label = 'DiziShqip';
  public readonly contentTypes: ContentType[] = ['movie', 'series'];
  public readonly countryCodes: CountryCode[] = [CountryCode.al];
  public readonly baseUrl = 'https://dizishqip.tv';
  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();
    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);
    const [name] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId, 'tr');

    const pageUrl = await this.fetchPageUrl(ctx, tmdbId, 'tr');
    if (!pageUrl) return [];

    let episodeUrl: URL = pageUrl;
    let absoluteEpisode: number | undefined;

    if (tmdbId.season && tmdbId.episode) {
      const fetchedEpisode = await this.fetchEpisodeUrl(ctx, pageUrl, tmdbId);
      if (!fetchedEpisode) return [];
      episodeUrl = fetchedEpisode.url;
      absoluteEpisode = fetchedEpisode.absoluteEpisode;
    }

    const html = await this.fetcher.text(ctx, episodeUrl);
    const $ = cheerio.load(html);

    const iframeUrls = $('#player2 iframe')
      .map((_i, el) => $(el).attr('src'))
      .get()
      .filter(Boolean)
      .map((src) => new URL(src, this.baseUrl));

    if (iframeUrls.length === 0) return [];

    return iframeUrls.map((iframeUrl) => ({
      url: iframeUrl,
      meta: {
        referer: episodeUrl.href,
        countryCodes: [CountryCode.al],
        title: absoluteEpisode
          ? `${name} – Episodi ${absoluteEpisode}`
          : name,
      },
    }));
  }

  private readonly fetchPageUrl = async (ctx: Context, tmdbId: TmdbId, language: string): Promise<URL | undefined> => {
    const [name] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId, language);
    const normalizeSearch = (title: string) =>
      title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')        // remove accents
        .replace(/[^\p{L}\p{N}\s]/gu, '')       // remove punctuation
        .replace(/\s+/g, ' ')                   // collapse spaces
        .trim()
        .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c')
        .replace(/ğ/g, 'g').replace(/ö/g, 'o').replace(/ü/g, 'u')
        .replace(/İ/g, 'I').replace(/Ş/g, 'S').replace(/Ç/g, 'C')
        .replace(/Ğ/g, 'G').replace(/Ö/g, 'O').replace(/Ü/g, 'U');

    const search = normalizeSearch(name).toLowerCase();
    const searchUrl = new URL(`/?s=${encodeURIComponent(search)}`, this.baseUrl);
    const html = await this.fetcher.text(ctx, searchUrl);
    const $ = cheerio.load(html);

    const seriesHref = $('.ml-item a[href*="/series/"]').first().attr('href');
    if (seriesHref) return new URL(seriesHref, this.baseUrl);

    const firstEpisode = $('.ml-item a[href*="/episode/"]').first().attr('href');
    if (firstEpisode) return new URL(firstEpisode, this.baseUrl);

    return undefined;
  };

  private async fetchEpisodeUrl(ctx: Context, pageUrl: URL, tmdbId: TmdbId): Promise<{ url: URL; absoluteEpisode: number } | undefined> {
    if (!tmdbId.season || !tmdbId.episode) return { url: pageUrl, absoluteEpisode: tmdbId.episode ?? 1 };

    // Fetch show details to compute absolute episode
    const showDetails = await getTmdbTvDetails(ctx, this.fetcher, tmdbId, 'tr');

    let absoluteEpisode = tmdbId.episode;

    // Compute absolute episode using seasons info
    if (showDetails.seasons) {
      for (const season of showDetails.seasons) {
        if (season.season_number < tmdbId.season) {
          absoluteEpisode += season.episode_count;
        }
      }
    }

    const html = await this.fetcher.text(ctx, pageUrl);
    const $ = cheerio.load(html);

    // Try to find the episode link using absolute episode number
    const episodeLink = $('a[href]')
      .toArray()
      .map(el => $(el).attr('href'))
      .find(href => href?.includes(`-episodi-${absoluteEpisode}`));

    if (episodeLink) return { url: new URL(episodeLink, this.baseUrl), absoluteEpisode };

    // Fallback: guessed URL
    const guessed = `${pageUrl.href.replace(/\/$/, '')}-episodi-${absoluteEpisode}/`;
    return { url: new URL(guessed), absoluteEpisode };
  }
}
