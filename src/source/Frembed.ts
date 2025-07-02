import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, Id } from '../utils';
import { Source, SourceResult } from './types';

export class Frembed implements Source {
  public readonly id = 'frembed';

  public readonly label = 'Frembed';

  public readonly contentTypes: ContentType[] = ['series'];

  public readonly countryCodes: CountryCode[] = [CountryCode.fr];

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  public async handle(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const apiUrl = new URL(`https://frembed.wiki/api/series?id=${tmdbId.id}&sa=${tmdbId.season}&epi=${tmdbId.episode}&idType=tmdb`);

    const json = JSON.parse(await this.fetcher.text(ctx, apiUrl));

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

    return urls.map(url => ({ countryCode: CountryCode.fr, title: `${json['title']} ${tmdbId.season}x${tmdbId.episode}`, url }));
  };
}
