import { Context, CountryCode, Format, UrlResult } from '../types';
import { Extractor } from './Extractor';

export class StreamEmbed extends Extractor {
  public readonly id = 'streamembed';

  public readonly label = 'StreamEmbed';

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/bullstream|mp4player|watch\.gxplayer/);
  }

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> {
    const html = await this.fetcher.text(ctx, url);

    const video = JSON.parse((html.match(/video ?= ?(.*);/) as string[])[1] as string);

    return [
      {
        url: new URL(`/m3u8/${video.uid}/${video.md5}/master.txt?s=1&id=${video.id}&cache=${video.status}`, url.origin),
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${countryCode}`,
        ttl: this.ttl,
        meta: {
          countryCodes: [countryCode],
          height: parseInt(JSON.parse(video.quality)[0]),
          title: decodeURIComponent(video.title),
        },
      },
    ];
  };
}
