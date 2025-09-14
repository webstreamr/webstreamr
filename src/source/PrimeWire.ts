import crypto from 'crypto';
// eslint-disable-next-line import/no-named-as-default
import KeyvSqlite from '@keyv/sqlite';
import bytes from 'bytes';
import { Cacheable, CacheableMemory, Keyv } from 'cacheable';
import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getCacheDir, getImdbId, Id, ImdbId } from '../utils';
import { Source, SourceResult } from './Source';

interface PrimeSrcResponsePartial {
  servers: {
    name: string;
    key: string;
    file_size: string | null;
    file_name: string | null;
  }[];
}

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

    const pageIdMatch = pageUrl.pathname.match(/\/([0-9]{2,})/) as string[];
    const pageId = pageIdMatch[1];

    const primeSrcUrl = new URL(`https://primesrc.me/api/v1/s?s_id=${pageId}&type=movie`);

    if (imdbId.season) {
      const episodeId = await this.fetchEpisodeId(ctx, pageUrl, imdbId);
      if (!episodeId) {
        return [];
      }

      primeSrcUrl.searchParams.set('e_id', `${episodeId}`);
      primeSrcUrl.searchParams.set('type', 'tv');
    }

    const primeSrcResponse = JSON.parse(await this.fetcher.text(ctx, primeSrcUrl, { headers: { Referer: pageUrl.origin } })) as PrimeSrcResponsePartial;

    const linksTokenMatch = appJs.match(/t="(0\.x.*?)"/) as string[];
    const linksToken = linksTokenMatch[1] as string;

    return Promise.all(
      primeSrcResponse.servers.map(async ({ key, file_name, file_size }) => {
        const redirectUrl = new URL(`/links/gos/${key}`, this.baseUrl);

        let targetUrlHref = await this.redirectUrlCache.get<string>(redirectUrl.href);

        /* istanbul ignore if */
        if (!targetUrlHref) {
          const linkFetchUrl = new URL(redirectUrl.href.replace('/gos/', '/go/'));
          linkFetchUrl.searchParams.set('token', linksToken);
          targetUrlHref = JSON.parse(await this.fetcher.text(ctx, linkFetchUrl))['link'] as string;

          await this.redirectUrlCache.set<string>(redirectUrl.href, targetUrlHref);
        }

        return {
          url: new URL(targetUrlHref),
          meta: {
            countryCodes: [CountryCode.en],
            ...(file_name && { title: file_name }),
            ...(file_size && { bytes: bytes.parse(file_size) as number }),
          },
        };
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

  private readonly fetchEpisodeId = async (ctx: Context, pageUrl: URL, imdbId: ImdbId): Promise<number | undefined> => {
    const pageHtml = await this.fetcher.text(ctx, pageUrl);

    const $ = cheerio.load(pageHtml);

    return $(`div[data-id="${imdbId.season}"]`)
      .children(`.tv_episode_item:nth-child(${imdbId.episode})`)
      .children('.episode-checkbox')
      .map((_i, el) => parseInt($(el).val() as string))
      .get(0);
  };
}
