import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, Id } from '../utils';
import { Source, SourceResult } from './types';

interface MovixApiData {
  player_links: { decoded_url: string }[];
}

export class Movix implements Source {
  public readonly id = 'movix';

  public readonly label = 'Movix';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.fr];

  private readonly baseUrl = 'https://api.movix.site';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  public async handle(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const apiUrl = tmdbId.season
      ? new URL(`/api/tmdb/tv/${tmdbId.id}?season=${tmdbId.season}&episode=${tmdbId.episode}`, this.baseUrl)
      : new URL(`/api/tmdb/movie/${tmdbId.id}`, this.baseUrl);

    const json = JSON.parse(await this.fetcher.text(ctx, apiUrl));
    const data: MovixApiData = tmdbId.season ? json['current_episode'] : json;

    const urls: URL[] = data['player_links'].map(({ decoded_url }) => new URL(decoded_url));

    const title = tmdbId.season
      ? `${json['tmdb_details']['title']} ${tmdbId.season}x${tmdbId.episode}`
      : json['tmdb_details']['title'];

    return urls.map(url => ({ countryCode: CountryCode.fr, title, url }));
  };
}
