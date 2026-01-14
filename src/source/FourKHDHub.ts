import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { BasicAcceptedElems, CheerioAPI } from 'cheerio';
import { AnyNode } from 'domhandler';
import levenshtein from 'fast-levenshtein';
import memoize from 'memoizee';
import rot13Cipher from 'rot13-cipher';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode, Meta } from '../types';
import { Fetcher, findCountryCodes, getTmdbId, getTmdbNameAndYear, Id, TmdbId } from '../utils';
import { Source, SourceResult } from './Source';

export class FourKHDHub extends Source {
  public readonly id = '4khdhub';

  public readonly label = '4KHDHub';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.multi, CountryCode.hi, CountryCode.ta, CountryCode.te];

  public readonly baseUrl = 'https://4khdhub.dad';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;

    this.getBaseUrl = memoize(this.getBaseUrl, {
      maxAge: 3600000, // 1 hour
      normalizer: () => 'baseUrl',
    });
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const pageUrl = await this.fetchPageUrl(ctx, tmdbId);
    if (!pageUrl) {
      return [];
    }

    const html = await this.fetcher.text(ctx, pageUrl);
    const $ = cheerio.load(html);

    if (tmdbId.season) {
      return Promise.all(
        $(`.episode-item`)
          .filter((_i, el) => $('.episode-title', el).text().includes(`S${String(tmdbId.season).padStart(2, '0')}`))
          .map((_i, el) => ({
            countryCodes: findCountryCodes($(el).html() as string),
            downloadItem: $('.episode-download-item', el)
              .filter((_i, el) => $(el).text().includes(`Episode-${String(tmdbId.episode).padStart(2, '0')}`))
              .get(0),
          })).filter((_i, { downloadItem }) => downloadItem !== undefined)
          .map(async (_id, { countryCodes, downloadItem }) => await this.extractSourceResults(ctx, $, downloadItem as BasicAcceptedElems<AnyNode>, countryCodes))
          .toArray(),
      );
    }

    return Promise.all(
      $(`.download-item`)
        .map(async (_i, el) => await this.extractSourceResults(ctx, $, el, findCountryCodes($(el).html() as string)))
        .toArray(),
    );
  };

  private readonly fetchPageUrl = async (ctx: Context, tmdbId: TmdbId): Promise<URL | undefined> => {
    const [name, year] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId);

    const searchUrl = new URL(`/?s=${encodeURIComponent(name)}`, await this.getBaseUrl(ctx));
    const html = await this.fetcher.text(ctx, searchUrl);

    const $ = cheerio.load(html);

    return $(`.movie-card:has(.movie-card-format:contains("${tmdbId.season ? 'Series' : 'Movies'}"))`)
      .filter((_i, el) => {
        const movieCardYear = parseInt($('.movie-card-meta', el).text());

        return Math.abs(movieCardYear - year) <= 1;
      })
      .filter((_i, el) => {
        const movieCardTitle = $('.movie-card-title', el)
          .text()
          .replace(/\[.*?]/, '')
          .trim();

        const diff = levenshtein.get(movieCardTitle, name, { useCollator: true });

        return diff < 5
          || (movieCardTitle.includes(name) && diff < 16);
      })
      .map(async (_i, el) => new URL($(el).attr('href') as string, await this.getBaseUrl(ctx)))
      .get(0);
  };

  private readonly extractSourceResults = async (ctx: Context, $: CheerioAPI, el: BasicAcceptedElems<AnyNode>, countryCodes: CountryCode[]): Promise<SourceResult> => {
    const localHtml = $(el).html() as string;

    const sizeMatch = localHtml.match(/([\d.]+ ?[GM]B)/) as string[];
    const heightMatch = localHtml.match(/\d{3,}p/) as string[];

    const meta: Meta = {
      countryCodes: [...new Set([...countryCodes, ...findCountryCodes(localHtml)])],
      bytes: bytes.parse(sizeMatch[1] as string) as number,
      height: parseInt(heightMatch[0] as string),
      title: $('.file-title, .episode-file-title', el).text().trim(),
    };

    const redirectUrlHubCloud = $('a', el)
      .filter((_i, el) => $(el).text().includes('HubCloud'))
      .map((_i, el) => new URL($(el).attr('href') as string))
      .get(0);

    if (redirectUrlHubCloud) {
      return { url: await this.resolveRedirectUrl(ctx, redirectUrlHubCloud), meta };
    }

    const redirectUrlHubDrive = $('a', el)
      .filter((_i, el) => $(el).text().includes('HubDrive'))
      .map((_i, el) => new URL($(el).attr('href') as string))
      .get(0) as URL;

    const hubDriveHtml = await this.fetcher.text(ctx, await this.resolveRedirectUrl(ctx, redirectUrlHubDrive));
    const $2 = cheerio.load(hubDriveHtml);

    return { url: new URL($2('a:contains("HubCloud")').attr('href') as string), meta };
  };

  private async resolveRedirectUrl(ctx: Context, redirectUrl: URL): Promise<URL> {
    const redirectHtml = await this.fetcher.text(ctx, redirectUrl);
    const redirectDataMatch = redirectHtml.match(/'o','(.*?)'/) as string[];
    const redirectData = JSON.parse(atob(rot13Cipher(atob(atob(redirectDataMatch[1] as string))))) as { o: string };

    return new URL(atob(redirectData['o']));
  }

  private readonly getBaseUrl = async (ctx: Context): Promise<URL> => {
    return await this.fetcher.getFinalRedirectUrl(ctx, new URL(this.baseUrl));
  };
}
