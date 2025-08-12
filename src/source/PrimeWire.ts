import crypto from 'crypto';
import * as cheerio from 'cheerio';
import { Browser, BrowserErrorCaptureEnum } from 'happy-dom';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getImdbId, Id, ImdbId } from '../utils';
import { Source, SourceResult } from './types';

export class PrimeWire implements Source {
  public readonly id = 'primewire';

  public readonly label = 'PrimeWire';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.en];

  public readonly baseUrl = 'https://www.primewire.tf';

  private readonly fetcher: Fetcher;

  private readonly redirectUrlCache = new Map<string, URL>();

  public constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  public async handle(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const imdbId = await getImdbId(ctx, this.fetcher, id);

    // We need any non-protected entrypoint to grab the app.js
    const html = await this.fetcher.text(ctx, new URL('/legal', this.baseUrl));
    const appJsMatch = html.match(/src="(.*?app-.*\.js.*?)"/) as string[];
    const appJs = await this.fetcher.text(ctx, new URL(appJsMatch[1] as string, this.baseUrl));

    const pageUrl = await this.fetchPageUrl(ctx, appJs, imdbId);
    if (!pageUrl) {
      return [];
    }

    const pageHtml = await this.fetcher.text(ctx, pageUrl);

    let linksHtml = pageHtml;
    if (imdbId.season) {
      const episodeUrl = await this.fetchEpisodeUrl(pageHtml, imdbId);
      if (!episodeUrl) {
        return [];
      }

      linksHtml = await this.fetcher.text(ctx, episodeUrl);
    }

    const browser = new Browser({
      settings: {
        disableCSSFileLoading: true,
        disableComputedStyleRendering: true,
        disableJavaScriptFileLoading: true,
        errorCapture: BrowserErrorCaptureEnum.processLevel,
        fetch: {
          interceptor: {
            beforeAsyncRequest: async () => { /* silence */ },
          },
        },
      },
    });

    const linksPage = browser.newPage();
    linksPage.content = linksHtml;
    linksPage.evaluate(appJs);

    const $ = cheerio.load(linksPage.content);

    const linksTokenMatch = appJs.match(/t="(0\.x.*?)"/) as string[];
    const linksToken = linksTokenMatch[1] as string;

    return Promise.all(
      $(`a.go-link`)
        .map((_i, el) => new URL($(el).attr('href') as string, this.baseUrl))
        .toArray()
        .map(async (redirectUrl) => {
          let targetUrl = this.redirectUrlCache.get(redirectUrl.href);

          if (!targetUrl) {
            const linkFetchUrl = new URL(redirectUrl.href.replace('/gos/', '/go/'));
            linkFetchUrl.searchParams.set('token', linksToken);
            targetUrl = new URL(JSON.parse(await this.fetcher.text(ctx, linkFetchUrl))['link']);

            this.redirectUrlCache.set(redirectUrl.href, targetUrl);
          }

          return { countryCode: CountryCode.en, url: targetUrl };
        }),
    );
  };

  private readonly fetchPageUrl = async (ctx: Context, appJs: string, imdbId: ImdbId): Promise<URL | undefined> => {
    const sha1SuffixMatch = appJs.match(/s\.value\+"(.*?)"/) as string[];

    const ds = crypto.createHash('sha1')
      .update(imdbId.id + sha1SuffixMatch[1])
      .digest('hex')
      .slice(0, 10);

    const searchResults = await this.fetcher.text(ctx, new URL(`/filter?s=${encodeURIComponent(imdbId.id)}&ds=${encodeURIComponent(ds)}`, this.baseUrl));

    const $ = cheerio.load(searchResults);

    return $('.index_item a')
      .map((_i, el) => new URL($(el).attr('href') as string, this.baseUrl))
      .get(0);
  };

  private readonly fetchEpisodeUrl = async (pageHtml: string, imdbId: ImdbId): Promise<URL | undefined> => {
    const $ = cheerio.load(pageHtml);

    return $(`div[data-id="${imdbId.season}"]`)
      .children(`.tv_episode_item:nth-child(${imdbId.episode})`)
      .children('a[href]')
      .map((_i, el) => new URL($(el).attr('href') as string, this.baseUrl))
      .get(0);
  };
}
