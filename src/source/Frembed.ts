import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, getTmdbNameAndYear, Id } from '../utils';
import { Source, SourceResult } from './Source';

export class Frembed extends Source {
  public readonly id = 'frembed';

  public readonly label = 'Frembed';

  public readonly contentTypes: ContentType[] = ['movie', 'series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.fr];

  public readonly baseUrl = 'https://frembed.my'; // TODO: determine this more dynamically, e.g. via https://audin213.com/

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);
    const [, year] = await getTmdbNameAndYear(ctx, this.fetcher, tmdbId);

    const apiUrl = tmdbId.season
      ? new URL(`/api/series?id=${tmdbId.id}&sa=${tmdbId.season}&epi=${tmdbId.episode}&idType=tmdb`, this.baseUrl)
      : new URL(`/api/films?id=${tmdbId.id}&idType=tmdb`, this.baseUrl);

    const json = await this.fetcher.json(ctx, apiUrl, { headers: { Referer: this.baseUrl } });

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
      ? `${json['title']} S${tmdbId.season} E${tmdbId.episode}`
      : `${json['title']} (${year})`;

    return urls.map(url => ({ url, meta: { countryCodes: [CountryCode.fr], referer: this.baseUrl, title } }));
  };
}
