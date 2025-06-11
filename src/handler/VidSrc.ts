import { ContentType } from 'stremio-addon-sdk';
import { Handler } from './types';
import { Fetcher, getImdbId, Id } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context, CountryCode } from '../types';

export class VidSrc implements Handler {
  readonly id = 'vidsrc';

  readonly label = 'VidSrc';

  readonly contentTypes: ContentType[] = ['movie', 'series'];

  readonly countryCodes: CountryCode[] = ['en'];

  private readonly baseUrl = 'https://vidsrc.xyz';

  private readonly fetcher: Fetcher;
  private readonly extractorRegistry: ExtractorRegistry;

  constructor(fetcher: Fetcher, extractorRegistry: ExtractorRegistry) {
    this.fetcher = fetcher;
    this.extractorRegistry = extractorRegistry;
  }

  readonly handle = async (ctx: Context, _type: string, id: Id) => {
    const imdbId = await getImdbId(ctx, this.fetcher, id);

    const embedUrl = imdbId.season
      ? new URL(`/embed/tv/${imdbId.id}/${imdbId.season}/${imdbId.episode}`, this.baseUrl)
      : new URL(`/embed/movie/${imdbId.id}`, this.baseUrl);

    return [
      await this.extractorRegistry.handle(ctx, embedUrl, { countryCode: 'en' }),
    ];
  };
}
