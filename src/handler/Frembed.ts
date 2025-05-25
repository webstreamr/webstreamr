import axios from 'axios';
import { Handler } from './types';
import { parseImdbId, Fetcher, getTmdbIdFromImdbId } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context, CountryCode } from '../types';

export class Frembed implements Handler {
  readonly id = 'frembed';

  readonly label = 'Frembed';

  readonly contentTypes = ['series'];

  readonly countryCodes: CountryCode[] = ['fr'];

  private readonly fetcher: Fetcher;
  private readonly extractorRegistry: ExtractorRegistry;

  constructor(fetcher: Fetcher, extractorRegistry: ExtractorRegistry) {
    this.fetcher = fetcher;
    this.extractorRegistry = extractorRegistry;
  }

  readonly handle = async (ctx: Context, _type: string, id: string) => {
    if (!id.startsWith('tt')) {
      return [];
    }

    const tmdbId = await getTmdbIdFromImdbId(ctx, this.fetcher, parseImdbId(id));

    const response = await this.apiCall(ctx, new URL(`https://frembed.club/api/series?id=${tmdbId.id}&sa=${tmdbId.series}&epi=${tmdbId.episode}&idType=tmdb`));
    if (!response) {
      return [];
    }

    const json = JSON.parse(response);

    const urls: URL[] = [];
    for (const key in json) {
      if (key.startsWith('link')) {
        try {
          urls.push(new URL(json[key].trim()));
        } catch {
          // Skip invalid URL
        }
      }
    }

    return Promise.all(urls.map(url => this.extractorRegistry.handle(ctx, url, { countryCode: 'fr' })));
  };

  private readonly apiCall = async (ctx: Context, url: URL): Promise<string | undefined> => {
    try {
      return await this.fetcher.text(ctx, url);
    } catch (error) {
      /* istanbul ignore next */
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }

      /* istanbul ignore next */
      throw error;
    }
  };
}
