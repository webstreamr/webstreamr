import * as cheerio from 'cheerio';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode, Meta } from '../types';
import { Fetcher, findCountryCodes, getImdbId, Id, ImdbId } from '../utils';
import { resolveRedirectUrl } from './hd-hub-helper';
import { Source, SourceResult } from './Source';

interface SearchResponsePartial {
  hits: {
    document: {
      imdb_id: string;
      permalink: string;
      post_title: string;
    };
  }[];
}

export class HDHub4u extends Source {
  public readonly id = 'hdhub4u';

  public readonly label = 'HDHub4u';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.multi, CountryCode.gu, CountryCode.hi, CountryCode.ml, CountryCode.pa, CountryCode.ta, CountryCode.te];

  public readonly baseUrl = 'https://new5.hdhub4u.fo';

  private readonly searchUrl = 'https://search.pingora.fyi';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const imdbId = await getImdbId(ctx, this.fetcher, id);

    const pageUrls = await this.fetchPageUrls(ctx, imdbId);

    return (await Promise.all(
      pageUrls.map(async (pageUrl) => {
        return await this.handlePage(ctx, pageUrl, imdbId);
      }),
    )).flat();
  };

  private readonly handlePage = async (ctx: Context, pageUrl: URL, imdbId: ImdbId): Promise<SourceResult[]> => {
    const html = await this.fetcher.text(ctx, pageUrl);

    const $ = cheerio.load(html);

    const meta = {
      countryCodes: [CountryCode.multi, ...findCountryCodes($('div:contains("Language"):not(:has(div)):first').text())],
    };

    if (!imdbId.episode) {
      return [
        ...this.extractHubDriveUrlResults(html, meta),
        ...(await Promise.all(
          $('a[href*="gadgetsweb"]').map((_i, el) => this.handleHubLinks(ctx, new URL($(el).attr('href') as string), pageUrl, meta)),
        )).flat(),
      ];
    }

    return [
      ...(await Promise.all(
        $(`a:contains("EPiSODE ${imdbId.episode}"), a:contains("EPiSODE ${String(imdbId.episode).padStart(2, '0')}")`)
          .map(async (_i, el) => this.handleHubLinks(ctx, new URL($(el).attr('href') as string), pageUrl, meta)),
      )).flat(),
      ...this.extractHubDriveUrlResults(
        $(`h4:contains("EPiSODE ${imdbId.episode}"), h4:contains("EPiSODE ${String(imdbId.episode).padStart(2, '0')}")`)
          .first()
          .nextUntil('hr')
          .map((_i, el) => $.html(el))
          .get()
          .join(''),
        meta,
      ),
    ];
  };

  private readonly handleHubLinks = async (ctx: Context, redirectUrl: URL, refererUrl: URL, meta: Meta): Promise<SourceResult[]> => {
    const hubLinksUrl = await resolveRedirectUrl(ctx, this.fetcher, redirectUrl);
    const hubLinksHtml = await this.fetcher.text(ctx, hubLinksUrl, { headers: { Referer: refererUrl.href } });

    return [
      ...this.extractHubDriveUrlResults(hubLinksHtml, { ...meta, referer: hubLinksUrl.href }),
    ];
  };

  private readonly extractHubDriveUrlResults = (html: string, meta: Meta): SourceResult[] => {
    const $ = cheerio.load(html);

    return $('a[href*="hubdrive"]:not(:contains("⚡"))')
      .map((_i, el) => ({ url: new URL($(el).attr('href') as string), meta }))
      .toArray();
  };

  private readonly fetchPageUrls = async (ctx: Context, imdbId: ImdbId): Promise<URL[]> => {
    const searchUrl = new URL(`/collections/post/documents/search?query_by=imdb_id&q=${encodeURIComponent(imdbId.id)}`, this.searchUrl);
    const searchResponse = await this.fetcher.json(ctx, searchUrl, { headers: { Referer: this.baseUrl } }) as SearchResponsePartial;

    return searchResponse.hits
      .filter(hit =>
        hit.document.imdb_id === imdbId.id
        && (
          !imdbId.season
          || hit.document.post_title.includes(`Season ${imdbId.season}`)
          || hit.document.post_title.includes(`S${String(imdbId.season)}`)
          || hit.document.post_title.includes(`S${String(imdbId.season).padStart(2, '0')}`)
        ),
      )
      .map(hit => new URL(hit.document.permalink, this.baseUrl));
  };
}
