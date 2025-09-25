import { Context, Format, Meta, UrlResult } from '../types';
import { Extractor } from './Extractor';

export class StreamEmbed extends Extractor {
  public readonly id = 'streamembed';

  public readonly label = 'StreamEmbed';

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/bullstream|mp4player|watch\.gxplayer/);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const html = await this.fetcher.text(ctx, url, { headers });

    const video = JSON.parse((html.match(/video ?= ?(.*);/) as string[])[1] as string);

    return [
      {
        url: new URL(`/m3u8/${video.uid}/${video.md5}/master.txt?s=1&id=${video.id}&cache=${video.status}`, url.origin),
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          height: parseInt(JSON.parse(video.quality)[0]),
          title: decodeURIComponent(video.title),
        },
      },
    ];
  };
}
