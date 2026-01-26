import { BlockedError } from '../error';
import { BlockedReason, Context, Format, InternalUrlResult, Meta } from '../types';
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

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<InternalUrlResult[]> {
    const headers = { 'Referer': 'https://www.rgshows.ru/', 'Origin': 'https://www.rgshows.ru', 'User-Agent': 'Mozilla' };

    const data = await this.fetcher.json(ctx, url, { headers }) as RgShowsApiData;

    const streamUrl = new URL(data.stream.url);
    /* istanbul ignore if */
    if (streamUrl.host.includes('vidzee')) {
      throw new BlockedError(url, BlockedReason.unknown, {});
    }

    const isMp4 = streamUrl.href.includes('mp4');
    const isHls = streamUrl.href.includes('m3u8') || streamUrl.href.includes('txt');

    return [
      {
        url: streamUrl,
        format: isMp4 ? Format.mp4 : (isHls ? Format.hls : /* istanbul ignore next */ Format.unknown),
        meta: {
          ...meta,
          ...(isHls && { height: meta.height ?? await guessHeightFromPlaylist(ctx, this.fetcher, streamUrl, { headers }) }),
        },
        requestHeaders: headers,
      },
    ];
  };
}
