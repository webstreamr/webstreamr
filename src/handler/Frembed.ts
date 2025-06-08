import { ContentType } from 'stremio-addon-sdk';
import { Handler } from './types';
import { Fetcher, getTmdbIdFromImdbId, ImdbId, TmdbId } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context, CountryCode } from '../types';

export class Frembed implements Handler {
  readonly id = 'frembed';

  readonly label = 'Frembed';

  readonly contentTypes: ContentType[] = ['series'];

  readonly countryCodes: CountryCode[] = ['fr'];

  private readonly fetcher: Fetcher;
  private readonly extractorRegistry: ExtractorRegistry;

  constructor(fetcher: Fetcher, extractorRegistry: ExtractorRegistry) {
    this.fetcher = fetcher;
    this.extractorRegistry = extractorRegistry;
  }

  readonly handle = async (ctx: Context, _type: string, id: string) => {
    let tmdbId: TmdbId;
    if (id.startsWith('tt')) {
      tmdbId = await getTmdbIdFromImdbId(ctx, this.fetcher, ImdbId.fromString(id));
    } else if (/^\d+:/.test(id)) {
      tmdbId = TmdbId.fromString(id);
    } else {
      return [];
    }

    const apiUrl = new URL(`https://frembed.space/api/series?id=${tmdbId.id}&sa=${tmdbId.series}&epi=${tmdbId.episode}&idType=tmdb`);

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

    return Promise.all(
      urls.map(url => this.extractorRegistry.handle({ ...ctx, referer: apiUrl }, url, { countryCode: 'fr', title: `${json['title']} ${tmdbId.series}x${tmdbId.episode}` })),
    );
  };
}
