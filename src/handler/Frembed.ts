import { ContentType } from 'stremio-addon-sdk';
import { Handler, HandleResult } from './types';
import { Fetcher, getTmdbId, Id } from '../utils';
import { Context, CountryCode } from '../types';

export class Frembed implements Handler {
  readonly id = 'frembed';

  readonly label = 'Frembed';

  readonly contentTypes: ContentType[] = ['series'];

  readonly countryCodes: CountryCode[] = [CountryCode.fr];

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly handle = async (ctx: Context, _type: string, id: Id): Promise<HandleResult[]> => {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const apiUrl = new URL(`https://frembed.space/api/series?id=${tmdbId.id}&sa=${tmdbId.season}&epi=${tmdbId.episode}&idType=tmdb`);

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

    return urls.map(url => ({ countryCode: CountryCode.fr, referer: apiUrl, title: `${json['title']} ${tmdbId.season}x${tmdbId.episode}`, url }));
  };
}
