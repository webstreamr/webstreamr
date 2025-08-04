import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getImdbId, Id } from '../utils';
import { Source, SourceResult } from './types';

export class VidSrc implements Source {
  public readonly id = 'vidsrc';

  public readonly label = 'VidSrc';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.en];

  public readonly baseUrl = 'https://vidsrc.xyz';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  public async handle(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const imdbId = await getImdbId(ctx, this.fetcher, id);

    const url = imdbId.season
      ? new URL(`/embed/tv/${imdbId.id}/${imdbId.season}/${imdbId.episode}`, this.baseUrl)
      : new URL(`/embed/movie/${imdbId.id}`, this.baseUrl);

    return [{ countryCode: CountryCode.en, url }];
  };
}
