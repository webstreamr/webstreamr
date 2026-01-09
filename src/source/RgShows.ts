import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, getTmdbNameAndYear, Id } from '../utils';
import { Source, SourceResult } from './Source';

export class RgShows extends Source {
  public readonly id = 'rgshows';

  public readonly label = 'RgShows';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.en];

  public readonly baseUrl = 'https://rgshows.ru';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);
    const [name, year] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId);

    let title: string = name;
    if (tmdbId.season) {
      title += ` ${tmdbId.formatSeasonAndEpisode()}`;
    } else {
      title += ` (${year})`;
    }

    const url = tmdbId.season
      ? new URL(`https://api.rgshows.ru/main/tv/${tmdbId.id}/${tmdbId.season}/${tmdbId.episode}`, this.baseUrl)
      : new URL(`https://api.rgshows.ru/main/movie/${tmdbId.id}`, this.baseUrl);

    return [{ url, meta: { countryCodes: [CountryCode.multi], title } }];
  };
}
