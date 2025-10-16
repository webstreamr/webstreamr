import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, getTmdbNameAndYear, Id } from '../utils';
import { Source, SourceResult } from './Source';

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

    const [title, year] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId);
    const cleanTitle = title.replace(/[:]/g, '');
    const query = encodeURIComponent(`${cleanTitle} ${year}`);
    const searchUrl = new URL(`/?s=${query}`, this.baseUrl);
    const searchHtml = await this.fetcher.text(ctx, searchUrl);

    const linkMatch = searchHtml.match(/class=["']title["'][^>]*><a href=["']([^"']+)["']/);
    if (!linkMatch?.[1]) return [];
    const pageUrl = new URL(linkMatch[1], this.baseUrl);
    const pageHtml = await this.fetcher.text(ctx, pageUrl);

    // --- Helper: check if a URL returns valid page ---
    const testUrl = async (url: URL) => {
      try {
        const html = await this.fetcher.text(ctx, url);
        return !/not\s+found/i.test(html) && html.length > 100;
      } catch { return false; }
    };

    if (tmdbId.season) {
      if (!/seriale/i.test(pageUrl.pathname)) return [];

      const serieSlugMatch = pageUrl.pathname.match(/\/seriale\/([^/]+)/);
      if (!serieSlugMatch?.[1]) return [];
      let serieSlug = serieSlugMatch[1].replace(/-me-titra-shqip\/?$/, '').replace(/\/$/, '');
      serieSlug = serieSlug.replace(/-\d{4}$/, '');

      const episodeUrl = new URL(`/episodi/${serieSlug}-${tmdbId.season}x${tmdbId.episode}-me-titra-shqip/`, this.baseUrl);
      const episodeHtml = await this.fetcher.text(ctx, episodeUrl);

      const postIdMatch = episodeHtml.match(/<li[^>]+data-post=['"](\d+)['"]/);
      if (!postIdMatch?.[1]) return [];
      const postId = postIdMatch[1];

      const results: SourceResult[] = [];
      for (const server of [1, 2]) {
        const ajaxUrl = new URL(`/wp-json/dooplayer/v2/${postId}/tv/${server}`, this.baseUrl);
        const json = await this.fetcher.json(ctx, ajaxUrl) as any;

        const urls: string[] = [];
        if (json.embed_url) urls.push(json.embed_url);
        if (Array.isArray(json.sources)) urls.push(...json.sources.map((s: any) => s.file));

        for (let embed of urls) {
          embed = embed.replace(/\\/g, '').replace(/^http:/, 'https:');

          const url = new URL(embed);
          if (await testUrl(url)) {
            results.push({
              url,
              meta: {
                countryCodes: [CountryCode.al],
                referer: this.baseUrl,
                title: `${title} S${tmdbId.season}E${tmdbId.episode}`,
              },
            });
          }
        }
      }
      return results;
    }

    const postIdMatch = pageHtml.match(/<li[^>]+data-post=['"](\d+)['"]/);
    if (!postIdMatch?.[1]) return [];
    const postId = postIdMatch[1];

    const results: SourceResult[] = [];
    for (const server of [1, 2]) {
      const ajaxUrl = new URL(`/wp-json/dooplayer/v2/${postId}/movie/${server}`, this.baseUrl);
      const json = await this.fetcher.json(ctx, ajaxUrl) as any;

      const urls: string[] = [];
      if (json.embed_url) urls.push(json.embed_url);
      if (Array.isArray(json.sources)) urls.push(...json.sources.map((s: any) => s.file));

      for (let embed of urls) {
        embed = embed.replace(/\\/g, '').replace(/^http:/, 'https:');

        const url = new URL(embed);
        if (await testUrl(url)) {
          results.push({
            url,
            meta: {
              countryCodes: [CountryCode.al],
              referer: this.baseUrl,
              title,
            },
          });
        }
      }
    }
    return results;
  }
}
