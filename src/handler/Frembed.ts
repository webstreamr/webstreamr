import axios from 'axios';
import { Handler } from './types';
import { parseImdbId, Fetcher } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context } from '../types';

export class Frembed implements Handler {
  readonly id = 'frembed';

  readonly label = 'Frembed';

  readonly contentTypes = ['series'];

  readonly languages = ['fr'];

  private readonly fetcher: Fetcher;
  private readonly embedExtractors: ExtractorRegistry;

  constructor(fetcher: Fetcher, embedExtractors: ExtractorRegistry) {
    this.fetcher = fetcher;
    this.embedExtractors = embedExtractors;
  }

  readonly handle = async (ctx: Context, _type: string, id: string) => {
    if (!id.startsWith('tt')) {
      return [];
    }

    const imdbId = parseImdbId(id);

    const response = await this.apiCall(ctx, new URL(`https://frembed.club/api/series?id=${imdbId.id}&sa=${imdbId.series}&epi=${imdbId.episode}&idType=imdb`));
    if (!response) {
      return [];
    }

    const json = JSON.parse(response);

    const urls: URL[] = [];
    for (const key in json) {
      if (key.startsWith('link')) {
        try {
          urls.push(new URL(json[key]));
        } catch {
          // Skip invalid URL
        }
      }
    }

    return Promise.all(urls.map(url => this.embedExtractors.handle(ctx, url, 'fr')));
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
