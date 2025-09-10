import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import { extractUrlFromPacked, guessHeightFromPlaylist } from '../utils';
import { Extractor } from './Extractor';

export class SuperVideo extends Extractor {
  public readonly id = 'supervideo';

  public readonly label = 'SuperVideo';

  public override readonly ttl: number = 10800000; // 3h

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/supervideo/);
  }

  public override normalize(url: URL): URL {
    const fileUrl = new URL(url.href.replace('/e/', '/').replace('/k/', '/').replace('/embed-', '/').replace('.html', ''));

    return new URL(`/e${fileUrl.pathname}`, fileUrl.origin);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.origin };

    const html = await this.fetcher.text(ctx, url, { headers });

    if (/'The file was deleted|The file expired|Video is processing/.test(html) || !html.includes('p,a,c,k,e,d')) {
      throw new NotFoundError();
    }

    const m3u8Url = extractUrlFromPacked(html, [/sources:\[{file:"(.*?)"/]);

    return [
      {
        url: m3u8Url,
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          height: await guessHeightFromPlaylist(ctx, this.fetcher, m3u8Url, { headers }),
        },
      },
    ];
  };
}
