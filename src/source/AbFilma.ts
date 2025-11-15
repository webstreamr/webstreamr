import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, getTmdbNameAndYear, Id, TmdbId } from '../utils';
import { Source, SourceResult } from './Source';

export class AbFilma extends Source {
  public readonly id = 'abfilma';
  public readonly label = 'ABFilma';
  public readonly contentTypes: ContentType[] = ['movie'];
  public readonly countryCodes: CountryCode[] = [CountryCode.al];
  public readonly baseUrl = 'http://www.abfilma.net';
  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    super();
    this.fetcher = fetcher;
  }

  public async handleInternal(
    ctx: Context,
    _type: 'movie', // unused, kept for signature compatibility
    id: Id
  ): Promise<SourceResult[]> {
    const tmdbId: TmdbId = await getTmdbId(ctx, this.fetcher, id);
    const [titleSq] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId, 'en');
    if (!titleSq) return [];

    let pageUrl: URL | undefined;

    try {
      pageUrl = await this.fetchPageUrl(ctx, titleSq);
    } catch {}

    // fallback: try English title if Albanian search fails
    if (!pageUrl) {
      const [titleEn] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId, 'sq');
      if (titleEn) {
        try {
          pageUrl = await this.fetchPageUrl(ctx, titleEn);
        } catch {}
      }
    }

    if (!pageUrl) return [];
    return this.getEmbeds(ctx, pageUrl, titleSq);
  }

  private async fetchPageUrl(
    ctx: Context,
    title: string
  ): Promise<URL | undefined> {
    const searchUrl = new URL(`/search?q=${encodeURIComponent(title)}`, this.baseUrl);
    const html = await this.fetcher.text(ctx, searchUrl);
    const $ = cheerio.load(html);

    // pick the first search result
    const firstResult = $('.container #results a.post').first();
    const href = firstResult.attr('href');
    if (!href) return undefined;

    return new URL(href, this.baseUrl);
  }

  private async getEmbeds(
    ctx: Context,
    pageUrl: URL,
    title: string
  ): Promise<SourceResult[]> {
    const html = await this.fetcher.text(ctx, pageUrl);
    const $ = cheerio.load(html);
    const results: SourceResult[] = [];

    // iterate over each option in the server selector
    $('#serverselector option').each((_i, el) => {
      const embedUrl = $(el).attr('value');
      if (!embedUrl) return;

      // If the link ends with .mp4, use it directly
      const url = embedUrl.match(/\.mp4$/) ? embedUrl : embedUrl.replace(/^http:/, 'https:');

      results.push({
        url: new URL(url),
        meta: {
          countryCodes: [CountryCode.al],
          referer: pageUrl.toString(),
          title: `${title} - ABFilma`,
        },
      });
    });

    return results;
  }
}
