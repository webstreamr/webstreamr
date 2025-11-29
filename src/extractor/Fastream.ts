import bytes from 'bytes';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import { buildMediaFlowProxyExtractorStreamUrl, supportsMediaFlowProxy } from '../utils';
import { Extractor } from './Extractor';

export class Fastream extends Extractor {
  public readonly id = 'fastream';

  public readonly label = 'Fastream (MFP)';

  public override viaMediaFlowProxy = true;

  public supports(ctx: Context, url: URL): boolean {
    return null !== url.host.match(/fastream/) && supportsMediaFlowProxy(ctx);
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace('/e/', '/embed-').replace('/d/', '/embed-'));
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const downloadUrl = new URL(url.href.replace('/embed-', '/d/'));
    const html = await this.fetcher.text(ctx, downloadUrl, { headers });

    if (/No such file/.test(html)) {
      throw new NotFoundError();
    }

    const playlistUrl = await buildMediaFlowProxyExtractorStreamUrl(ctx, this.fetcher, 'Fastream', url, headers);

    const heightAndSizeMatch = html.match(/\d{3,}x(\d{3,}), ([\d.]+ ?[GM]B)/) as string[];
    const titleMatch = html.match(/>Download (.*?)</) as string[];

    return [
      {
        url: playlistUrl,
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          bytes: bytes.parse(heightAndSizeMatch[2] as string) as number,
          height: parseInt(heightAndSizeMatch[1] as string),
          title: titleMatch[1],
        },
      },
    ];
  };
}
