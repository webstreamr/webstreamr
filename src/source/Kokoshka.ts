import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, Id } from '../utils';
import { Source, SourceResult } from './Source';
import { getTmdbIdFromImdbId, getTmdbNameAndYear } from '../utils/tmdb';
import { TmdbId } from '../utils/id';

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

  public async handleInternal(ctx: Context, type: string, imdbId: Id): Promise<SourceResult[]> {
    try {
      // 1. IMDb → TMDb
      let tmdbId: TmdbId;
      if (type === 'series') {
        const imdbBaseId = String(imdbId.id).split(':')[0];
        tmdbId = await getTmdbIdFromImdbId(ctx, this.fetcher, {
          id: imdbBaseId,
          season: imdbId.season,
          episode: imdbId.episode
        } as any);
        if (!tmdbId.season || !tmdbId.episode) return [];
      } else {
        tmdbId = await getTmdbIdFromImdbId(ctx, this.fetcher, { id: imdbId } as any);
      }

      // 2. Title + year
      const [title, year] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId);

      // Helper: check if a URL returns a valid page (not 404)
      const testUrl = async (ctx: Context, url: URL): Promise<boolean> => {
        try {
          const html = await this.fetcher.text(ctx, url);
          // crude but effective check for a dead embed page
          return !/not\s+found/i.test(html) && html.length > 100;
        } catch {
          return false;
        }
      };

       if (type === 'series') {
  // Try to find the correct series link via search
  const cleanTitle = title.replace(/[:]/g, '');
  const query = encodeURIComponent(`${cleanTitle} ${year}`); // include year in search
  const searchUrl = new URL(`/?s=${query}`, this.baseUrl);
  const searchHtml = await this.fetcher.text(ctx, searchUrl);

  // Find the first search result link
  const linkMatch = searchHtml.match(/class=["']title["'][^>]*><a href=["']([^"']+)["']/);
  if (!linkMatch?.[1]) return [];

  const serieUrl = new URL(linkMatch[1], this.baseUrl);

  // Only continue if the URL contains "seriale"
  if (!/seriale/i.test(serieUrl.pathname)) return [];

  // Extract the slug part for the series
  const serieSlugMatch = serieUrl.pathname.match(/\/seriale\/([^/]+)/);
  if (!serieSlugMatch?.[1]) return [];

  let serieSlug = serieSlugMatch[1]
    .replace(/-me-titra-shqip\/?$/, '') // remove suffix
    .replace(/\/$/, '');

  // Remove trailing year (e.g., -2025, -2019, etc.)
  serieSlug = serieSlug.replace(/-\d{4}$/, '');

  // Build episode URL using the found series slug (without year)
  const episodeUrl = new URL(
    `/episodi/${serieSlug}-${tmdbId.season}x${tmdbId.episode}-me-titra-shqip/`,
    this.baseUrl
  );

  const episodeHtml = await this.fetcher.text(ctx, episodeUrl);
  const postIdMatch = episodeHtml.match(/<li[^>]+data-post=['"](\d+)['"]/);
  if (!postIdMatch) return [];
  const postId = postIdMatch[1];

  // Try both TV servers
  for (const server of [1, 2]) {
    const ajaxUrl = new URL(`/wp-json/dooplayer/v2/${postId}/tv/${server}`, this.baseUrl);
    const json = (await this.fetcher.json(ctx, ajaxUrl)) as { embed_url?: string };
    if (!json?.embed_url) continue;

    const embedId = json.embed_url.replace(/\\/g, '').split('/').pop();
    if (!embedId) continue;

    const finalUrl = new URL(`https://jilliandescribecompany.com/e/${embedId}`);

    if (await testUrl(ctx, finalUrl)) {
      return [
        {
          url: finalUrl,
          meta: {
            countryCodes: [CountryCode.al],
            referer: this.baseUrl,
            title: `${title} S${tmdbId.season}E${tmdbId.episode}`,
          },
        },
      ];
    }
  }

  return [];
} else {
        // Movie
        const cleanTitle = title.replace(/[:]/g, '');
        const query = encodeURIComponent(`${cleanTitle} ${year}`);
        const searchUrl = new URL(`/?s=${query}`, this.baseUrl);
        const searchHtml = await this.fetcher.text(ctx, searchUrl);

        const linkMatch = searchHtml.match(/class=["']title["'][^>]*><a href=["']([^"']+)["']/);
        if (!linkMatch?.[1]) return [];

        const movieUrl = new URL(linkMatch[1], this.baseUrl);
        const movieHtml = await this.fetcher.text(ctx, movieUrl);
        const postIdMatch = movieHtml.match(/<li[^>]+data-post=['"](\d+)['"]/);
        if (!postIdMatch) return [];
        const postId = postIdMatch[1];

        // Try both movie servers
        for (const server of [1, 2]) {
          const ajaxUrl = new URL(`/wp-json/dooplayer/v2/${postId}/movie/${server}`, this.baseUrl);
          const json = await this.fetcher.json(ctx, ajaxUrl) as { embed_url?: string };
          if (!json?.embed_url) continue;

          const embedId = json.embed_url.replace(/\\/g, '').split('/').pop();
          if (!embedId) continue;

          const finalUrl = new URL(`https://jilliandescribecompany.com/e/${embedId}`);
          if (await testUrl(ctx, finalUrl)) {
            return [
              {
                url: finalUrl,
                meta: {
                  countryCodes: [CountryCode.al],
                  referer: this.baseUrl,
                  title,
                },
              },
            ];
          }
        }

        return [];
      }
    } catch (err) {
      console.error('Kokoshka handleInternal error:', err);
      return [];
    }
  }
}
