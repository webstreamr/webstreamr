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

    const streamUrl = new URL(data.stream.url);
    const isMp4 = streamUrl.href.includes('mp4');
    const isHls = streamUrl.href.includes('m3u8') || streamUrl.href.includes('txt');

    return [
      {
        url: streamUrl,
        format: isMp4 ? Format.mp4 : (isHls ? Format.hls : /* istanbul ignore next */ Format.unknown),
        label: this.label,
        ttl: this.ttl,
        meta: {
          ...meta,
          ...(isHls && { height: await guessHeightFromPlaylist(ctx, this.fetcher, streamUrl, url, { headers }) }),
        },
        requestHeaders: headers,
      },
    ];
  };
}
