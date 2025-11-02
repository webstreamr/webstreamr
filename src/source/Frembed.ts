import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, Id } from '../utils';
import { Source, SourceResult } from './Source';

export class Frembed extends Source {
  public readonly id = 'frembed';

  public readonly label = 'Frembed';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.fr];

  public readonly baseUrl = 'https://frembed.mom';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const apiUrl = tmdbId.season
      ? new URL(`/api/series?id=${tmdbId.id}&sa=${tmdbId.season}&epi=${tmdbId.episode}&idType=tmdb`, this.baseUrl)
      : new URL(`/api/films?id=${tmdbId.id}&idType=tmdb`, this.baseUrl);

    const json = await this.fetcher.json(ctx, apiUrl);

    const urls: URL[] = [];
    for (const key in json) {
      if (key.startsWith('link') && json[key] && !json[key].includes(',https')) {
        try {
          urls.push(new URL(json[key].trim()));
        } catch {
          // Skip invalid URL
        }
      }
    }

    const title = tmdbId.season
      ? `${json['title']} ${tmdbId.season}x${tmdbId.episode}`
      : json['title'];

    return urls.map(url => ({ url, meta: { countryCodes: [CountryCode.fr], referer: this.baseUrl, title } }));
  };
}
