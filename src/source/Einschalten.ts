import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, Id } from '../utils';
import { Source, SourceResult } from './types';

interface EinschaltenResponse {
  releaseName: string;
  streamUrl: string;
}

export class Einschalten implements Source {
  public readonly id = 'einschalten';

  public readonly label = 'Einschalten';

  public readonly contentTypes: ContentType[] = ['movie'];

  public readonly countryCodes: CountryCode[] = [CountryCode.de];

  public readonly baseUrl = 'https://einschalten.in';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  public async handle(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const { releaseName, streamUrl } = JSON.parse(await this.fetcher.text(ctx, new URL(`/api/movies/${tmdbId.id}/watch`, this.baseUrl))) as EinschaltenResponse;

    return [{ countryCode: CountryCode.de, title: releaseName, url: new URL(streamUrl) }];
  };
}
