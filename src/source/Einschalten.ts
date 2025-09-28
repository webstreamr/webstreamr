import { ContentType } from 'stremio-addon-sdk';
import { Context, CountryCode } from '../types';
import { Fetcher, getTmdbId, Id } from '../utils';
import { Source, SourceResult } from './Source';

interface EinschaltenResponse {
  releaseName: string;
  streamUrl: string;
}

export class Einschalten extends Source {
  public readonly id = 'einschalten';

  public readonly label = 'Einschalten';

  public readonly contentTypes: ContentType[] = ['movie'];

  public readonly countryCodes: CountryCode[] = [CountryCode.de];

  public readonly baseUrl = 'https://einschalten.in';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public async handleInternal(ctx: Context, _type: string, id: Id): Promise<SourceResult[]> {
    const tmdbId = await getTmdbId(ctx, this.fetcher, id);

    const { releaseName: title, streamUrl } = await this.fetcher.json(ctx, new URL(`/api/movies/${tmdbId.id}/watch`, this.baseUrl)) as EinschaltenResponse;

    return [{ url: new URL(streamUrl), meta: { countryCodes: [CountryCode.de], referer: (new URL(`/movies/${tmdbId.id}`, this.baseUrl)).href, title } }];
  };
}
