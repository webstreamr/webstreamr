import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, getTmdbNameAndYear, Id, TmdbId } from '../utils';
import { Source, SourceResult } from './Source';

export class Filma365 extends Source {
  public readonly id = 'filma365';
  public readonly label = 'Filma365';
  public readonly contentTypes: ContentType[] = ['movie', 'series'];
  public readonly countryCodes: CountryCode[] = [CountryCode.al];
  public readonly baseUrl = 'https://www.filma365.cc';
  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    super();
    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, type: string, id: Id): Promise<SourceResult[]> {
    if (!['movie', 'series'].includes(type)) return [];

    try {
      // Convert Id to TmdbId (handles ImdbId -> TmdbId)
      const tmdbId: TmdbId = await getTmdbId(ctx, this.fetcher, id);

      // Get Albanian title
      const [titleSq] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId, 'sq');

      let pageUrl: URL;

      if (type === 'movie') {
        // --- Movie URL ---
        const slug = titleSq
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-') // spaces & special chars to '-'
          .replace(/^-+|-+$/g, '');    // trim leading/trailing '-'

        pageUrl = new URL(`/movie/${slug}`, this.baseUrl);

        try {
          await this.fetcher.text(ctx, pageUrl); // throws 404 if not found
        } catch (err: any) {
          if (err.status === 404) {
            console.warn(`[Filma365] Movie page not found for "${titleSq}"`);
            return [];
          }
          throw err;
        }

      } else {
        // --- Series URL: need season & episode from TmdbId ---
        if (!tmdbId.season || !tmdbId.episode) {
          console.warn('[Filma365] Series season/episode info missing');
          return [];
        }

        const slug = titleSq
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        pageUrl = new URL(`/episode/${slug}/${tmdbId.season}-${tmdbId.episode}`, this.baseUrl);

        try {
          await this.fetcher.text(ctx, pageUrl); // throws 404 if not found
        } catch (err: any) {
          if (err.status === 404) {
            console.warn(`[Filma365] Episode page not found for "${titleSq}" S${tmdbId.season}E${tmdbId.episode}`);
            return [];
          }
          throw err;
        }
      }

      // --- Fetch page HTML ---
      const pageHtml = await this.fetcher.text(ctx, pageUrl);
      

      const results: SourceResult[] = [];
      const embedUrls: string[] = [];

      // --- Livewire snapshot ---
      const snapshotMatch = pageHtml.match(/wire:snapshot="([^"]+)"/);
      if (snapshotMatch?.[1]) {
        try {
          const snapshot = JSON.parse(snapshotMatch[1].replace(/&quot;/g, '"'));
          const videos = snapshot?.data?.videos ?? [];

          for (const serverGroup of videos) {
            for (const server of serverGroup) {
              if (Array.isArray(server) && server[0]?.link) {
                const embedLink = server[0].link.replace(/^http:/, 'https:');
                embedUrls.push(embedLink);
              }
            }
          }
        } catch (e) {
          console.warn('[Filma365] Failed to parse Livewire snapshot JSON', e);
        }
      }

      

      const uniqueEmbedUrls = [...new Set(embedUrls)];

      // --- Fetch each embed page for iframe providers ---
      for (const embedUrl of uniqueEmbedUrls) {
        try {
          const embedHtml = await this.fetcher.text(ctx, new URL(embedUrl));
          const $$ = cheerio.load(embedHtml);

          $$('iframe').each((_, iframe) => {
            const providerSrc = $$(iframe).attr('src');
            if (!providerSrc) return;

            results.push({
              url: new URL(providerSrc.replace(/^http:/, 'https:')),
              meta: {
                countryCodes: [CountryCode.al],
                referer: embedUrl,
                title: `${titleSq} - Filma365`,
              },
            });
          });
        } catch (e) {
          console.warn(`[Filma365] Failed to load or parse embed page: ${embedUrl}`, e);
        }
      }

      return results;

    } catch (err) {
      console.error('[Filma365] handleInternal error:', err);
      return [];
    }
  }
}
