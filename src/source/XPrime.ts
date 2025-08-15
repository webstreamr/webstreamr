import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, getTmdbNameAndYear, Id } from '../utils';
import { Source, SourceResult } from './types';

export class XPrime implements Source {
  public readonly id = 'xprime';

  public readonly label = 'XPrime';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.en];

  public readonly baseUrl = 'https://backend.xprime.tv';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  public async handle(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const [name, year] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId);

    if (tmdbId.season) {
      const title = `${name} ${tmdbId.season}x${tmdbId.episode}`;

      const urlPrimebox = new URL(`/primebox?name=${encodeURIComponent(name)}&year=${year}&season=${tmdbId.season}&episode=${tmdbId.episode}`, this.baseUrl);

      return [{ countryCode: CountryCode.en, title, url: urlPrimebox }];
    }

    const title = `${name} (${year})`;

    const urlPrimebox = new URL(`/primebox?name=${encodeURIComponent(name)}&year=${year}`, this.baseUrl);

    return [{ countryCode: CountryCode.en, title, url: urlPrimebox }];
  };
}
