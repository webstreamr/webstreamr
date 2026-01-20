import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import { buildMediaFlowProxyExtractorStreamUrl, supportsMediaFlowProxy } from '../utils';
import { Extractor } from './Extractor';

export class DoodStream extends Extractor {
  public readonly id = 'doodstream';

  public readonly label = 'DoodStream';

  public override readonly ttl: number = 21600000; // 6h

  public override viaMediaFlowProxy = true;

  /** @see https://github.com/Gujal00/ResolveURL/blob/master/script.module.resolveurl/lib/resolveurl/plugins/doodstream.py */
  public supports(ctx: Context, url: URL): boolean {
    return null !== url.host.match(/dood|do[0-9]go|doood|dooood|ds2play|ds2video|dsvplay|d0o0d|do0od|d0000d|d000d|myvidplay|vidply|all3do|doply|vide0|vvide0|d-s/) && supportsMediaFlowProxy(ctx);
  };

  public override normalize(url: URL): URL {
    const videoId = url.pathname.replace(/\/+$/, '').split('/').at(-1) as string;

    return new URL(`http://dood.to/e/${videoId}`);
  };

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const html = await this.fetcher.text(ctx, url, { headers });

    if (/Video not found/.test(html)) {
      throw new NotFoundError();
    }

    const $ = cheerio.load(html);
    const title = $('title').text().trim().replace(/ - DoodStream$/, '').trim();

    const downloadHtml = await this.fetcher.text(ctx, new URL(url.href.replace('/e/', '/d/')));
    const sizeMatch = downloadHtml.match(/([\d.]+ ?[GM]B)/);

    return [
      {
        url: await buildMediaFlowProxyExtractorStreamUrl(ctx, this.fetcher, 'Doodstream', url, headers),
        format: Format.mp4,
        label: this.label,
        ttl: this.ttl,
        meta: {
          ...meta,
          title,
          ...(sizeMatch && { bytes: bytes.parse(sizeMatch[1] as string) as number }),
        },
      },
    ];
  };
}
