import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getImdbId, getTmdbId, getTmdbNameAndYear, Id } from '../utils';
import { Source, SourceResult } from './Source';

export class XPrime extends Source {
  public readonly id = 'xprime';

  public readonly label = 'XPrime';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.en];

  public readonly baseUrl = 'https://backend.xprime.tv';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const imdbId = await getImdbId(ctx, this.fetcher, id);
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const [name, year] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId);

    const servers = ['primebox'];

    return servers.map((server) => {
      const url = new URL(`/${server}?name=${encodeURIComponent(name)}&year=${year}&id=${tmdbId.id}&imdbId=${imdbId.id}`, this.baseUrl);
      if (tmdbId.season) {
        url.searchParams.set('season', `${tmdbId.season}`);
        url.searchParams.set('episode', `${tmdbId.episode}`);
      }

      const title = tmdbId.season
        ? `${name} ${tmdbId.season}x${tmdbId.episode}`
        : `${name} (${year})`;

      return { url, meta: { countryCodes: [CountryCode.en], title } };
    });
  };
}
