import * as cheerio from 'cheerio';
import { Context, Format, Meta, UrlResult } from '../types';
import { guessHeightFromPlaylist } from '../utils';
import { Extractor } from './Extractor';

interface StreamUpApiData {
  streaming_url: string;
}

/** @see https://github.com/Gujal00/ResolveURL/blob/master/script.module.resolveurl/lib/resolveurl/plugins/streamup.py */
export class StreamUp extends Extractor {
  public readonly id = 'streamup';

  public readonly label = 'StreamUP';

  public override readonly ttl: number = 10800000; // 3h

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/streamup|strmup/) || [
      'vfaststream.com',
    ].includes(url.host);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = {
      'Referer': `${url.origin}/`,
      'Origin': url.origin,
      'User-Agent': 'Mozilla/5.0',
    };

    const html = await this.fetcher.text(ctx, url, { headers });

    const data = await this.fetcher.json(ctx, new URL(`/ajax/stream?filecode=${url.pathname.split('/').at(-1)}`, url), { headers }) as StreamUpApiData;
    const playlistUrl = new URL(data.streaming_url);

    const $ = cheerio.load(html);
    const title = $('title').text().trim();

    return [
      {
        url: playlistUrl,
        format: Format.hls,
        label: this.label,
        ttl: this.ttl,
        requestHeaders: headers,
        meta: {
          ...meta,
          height: await guessHeightFromPlaylist(ctx, this.fetcher, playlistUrl, url, { headers }),
          title,
        },
      },
    ];
  }
}
