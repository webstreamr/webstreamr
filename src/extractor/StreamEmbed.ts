import { NotFoundError } from '../error';
import { Context, Format, InternalUrlResult, Meta } from '../types';
import { Extractor } from './Extractor';

export class StreamEmbed extends Extractor {
  public readonly id = 'streamembed';

  public readonly label = 'StreamEmbed';

  public override readonly ttl: number = 259200000; // 3d

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/bullstream|mp4player|watch\.gxplayer/);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<InternalUrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const html = await this.fetcher.text(ctx, url, { headers });

    if (/Video is not ready/.test(html)) {
      throw new NotFoundError();
    }

    const video = JSON.parse((html.match(/video ?= ?(.*);/) as string[])[1] as string);

    return [
      {
        url: new URL(`/m3u8/${video.uid}/${video.md5}/master.txt?s=1&id=${video.id}&cache=${video.status}`, url.origin),
        format: Format.hls,
        meta: {
          ...meta,
          height: parseInt(JSON.parse(video.quality)[0]),
          title: decodeURIComponent(video.title),
        },
      },
    ];
  };
}
