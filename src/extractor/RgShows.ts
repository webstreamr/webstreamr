import { Context, Format, Meta, UrlResult } from '../types';
import { guessHeightFromPlaylist } from '../utils';
import { Extractor } from './Extractor';

interface RgShowsApiData {
  stream: {
    url: string;
  };
}

export class RgShows extends Extractor {
  public readonly id = 'rgshows';

  public readonly label = 'RgShows';

  public override readonly ttl: number = 10800000; // 3h

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/rgshows/);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const nonSubDomainUrl = new URL(url);
    nonSubDomainUrl.hostname = nonSubDomainUrl.hostname.split('.').slice(-2).join('.');
    const headers = { 'Referer': `${nonSubDomainUrl.origin}/`, 'Origin': nonSubDomainUrl.origin, 'User-Agent': 'Mozilla' };

    const data = await this.fetcher.json(ctx, url, { headers }) as RgShowsApiData;

    const playlistUrl = new URL(data.stream.url);

    return [
      {
        url: playlistUrl,
        format: Format.hls,
        label: this.label,
        ttl: this.ttl,
        meta: {
          ...meta,
          height: await guessHeightFromPlaylist(ctx, this.fetcher, playlistUrl, url, { headers }),
        },
        requestHeaders: headers,
      },
    ];
  };
}
