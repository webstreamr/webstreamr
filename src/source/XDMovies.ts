import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { BasicAcceptedElems, CheerioAPI } from 'cheerio';
import { AnyNode } from 'domhandler';
import memoize from 'memoizee';
import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode, Meta } from '../types';
import { Fetcher, findCountryCodes, getTmdbId, getTmdbNameAndYear, Id, TmdbId } from '../utils';
import { Source, SourceResult } from './Source';

interface GetTokenResponse {
  token: string;
}

interface SearchResponsePartial {
  tmdb_id: number;
  path: string;
  audio_languages: string;
}

export class XDMovies extends Source {
  public readonly id = 'xdmovies';

  public readonly label = 'XDMovies';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.multi, CountryCode.hi, CountryCode.ta, CountryCode.te, CountryCode.ml, CountryCode.bl, CountryCode.mr, CountryCode.kn, CountryCode.ja, CountryCode.ko, CountryCode.pa, CountryCode.gu];

  public readonly baseUrl = 'https://new.xdmovies.wtf';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;

    this.getToken = memoize(this.getToken, {
      maxAge: 3600000, // 1 hour
      normalizer: () => 'getToken',
    });
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const token = await this.getToken(ctx);

    const searchResponseEntry = await this.search(ctx, tmdbId, token);
    if (!searchResponseEntry) {
      return [];
    }

    const html = await this.fetcher.text(ctx, new URL(searchResponseEntry.path, this.baseUrl));
    const $ = cheerio.load(html);

    if (tmdbId.season) {
      return Promise.all(
        $(`#season-episodes-${tmdbId.season} .quality-section .episode-card:nth-child(${tmdbId.episode})`)
          .map(async (_i, el) => await this.extractSourceResults(ctx, $, el, searchResponseEntry))
          .toArray(),
      );
    }

    return Promise.all(
      $(`.download-item`)
        .map(async (_i, el) => await this.extractSourceResults(ctx, $, el, searchResponseEntry))
        .toArray(),
    );
  };

  private readonly getToken = async (ctx: Context): Promise<string> => {
    const getTokenUrl = new URL('/php/get_token.php', this.baseUrl);
    const getTokenResponse = (await this.fetcher.json(ctx, getTokenUrl)) as GetTokenResponse;

    return getTokenResponse.token;
  };

  private readonly search = async (ctx: Context, tmdbId: TmdbId, token: string): Promise<SearchResponsePartial | undefined> => {
    const [name] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId);

    const searchUrl = new URL(`/php/search_api.php?query=${encodeURIComponent(name)}&fuzzy=true`, this.baseUrl);
    const searchResponse = (await this.fetcher.json(ctx, searchUrl, { headers: { 'X-Auth-Token': token, 'X-Requested-With': 'XMLHttpRequest' } })) as SearchResponsePartial[];

    return searchResponse.find(searchResponseEntry => searchResponseEntry.tmdb_id === tmdbId.id);
  };

  private readonly extractSourceResults = async (ctx: Context, $: CheerioAPI, el: BasicAcceptedElems<AnyNode>, searchResponse: SearchResponsePartial): Promise<SourceResult> => {
    const localHtml = $(el).html() as string;

    const sizeMatch = localHtml.match(/([\d.]+ ?[GM]B)/);
    const heightMatch = localHtml.match(/\d{3,}p/) as string[];

    const meta: Meta = {
      countryCodes: [CountryCode.multi, ...findCountryCodes(searchResponse.audio_languages), ...findCountryCodes(localHtml)],
      height: parseInt(heightMatch[0] as string),
      title: $('.custom-title, .episode-title', el).text().trim(),
      ...(sizeMatch && { bytes: bytes.parse(sizeMatch[1] as string) as number }),
    };

    const url = $('a', el)
      .map((_i, el) => new URL($(el).attr('href') as string))
      .get(0) as URL;

    return { url: await this.fetcher.getFinalRedirectUrl(ctx, url, undefined, 1), meta };
  };
}
