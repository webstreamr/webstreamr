import crypto from 'crypto';
// eslint-disable-next-line import/no-named-as-default
import KeyvSqlite from '@keyv/sqlite';
import { Cacheable, CacheableMemory, Keyv } from 'cacheable';
import * as cheerio from 'cheerio';
import { JSDOM } from 'jsdom';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getCacheDir, getImdbId, Id, ImdbId } from '../utils';
import { Source, SourceResult } from './Source';

export class PrimeWire extends Source {
  public readonly id = 'primewire';

  public readonly label = 'PrimeWire';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.en];

  public readonly baseUrl = 'https://www.primewire.tf';

  private readonly fetcher: Fetcher;

  private readonly redirectUrlCache = new Cacheable({
    primary: new Keyv({ store: new CacheableMemory({ lruSize: 1024 }) }),
    secondary: new Keyv(new KeyvSqlite(`sqlite://${getCacheDir()}/webstreamr-primewire-redirect-url-cache.sqlite`)),
  });

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
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

    // Yes, we are aware of the risks.. 😰
    const jsdom = new JSDOM(linksHtml, { runScripts: 'dangerously' });
    const scriptElement = jsdom.window.document.createElement('script');
    scriptElement.textContent = appJs;
    jsdom.window.document.body.appendChild(scriptElement);

    const $ = cheerio.load(jsdom.window.document.documentElement.outerHTML);

    jsdom.window.close();

    const linksTokenMatch = appJs.match(/t="(0\.x.*?)"/) as string[];
    const linksToken = linksTokenMatch[1] as string;

    return Promise.all(
      $(`a.go-link`)
        .map((_i, el) => new URL($(el).attr('href') as string, this.baseUrl))
        .toArray()
        .map(async (redirectUrl) => {
          let targetUrlHref = await this.redirectUrlCache.get<string>(redirectUrl.href);

          /* istanbul ignore if */
          if (!targetUrlHref) {
            const linkFetchUrl = new URL(redirectUrl.href.replace('/gos/', '/go/'));
            linkFetchUrl.searchParams.set('token', linksToken);
            targetUrlHref = JSON.parse(await this.fetcher.text(ctx, linkFetchUrl))['link'] as string;

            await this.redirectUrlCache.set<string>(redirectUrl.href, targetUrlHref);
          }

          return { url: new URL(targetUrlHref), meta: { countryCodes: [CountryCode.en] } };
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
