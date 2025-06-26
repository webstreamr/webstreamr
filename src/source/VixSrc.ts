import { ContentType } from 'stremio-addon-sdk';
import { Source, SourceResult } from './types';
import { Fetcher, getTmdbId, Id } from '../utils';
import { Context, CountryCode } from '../types';

export class VixSrc implements Source {
  public readonly id = 'vixsrc';

  public readonly label = 'VixSrc';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.multi, CountryCode.it];

  private readonly baseUrl = 'https://vixsrc.to';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  public async handle(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const url = tmdbId.season
      ? new URL(`/tv/${tmdbId.id}/${tmdbId.season}/${tmdbId.episode}`, this.baseUrl)
      : new URL(`/movie/${tmdbId.id}`, this.baseUrl);

    return [{ countryCode: CountryCode.it, url }];
  };
}
