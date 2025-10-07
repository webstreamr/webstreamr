import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import {
  buildMediaFlowProxyExtractorStreamUrl,
  supportsMediaFlowProxy,
} from '../utils';
import { Extractor } from './Extractor';

/** @see https://github.com/Gujal00/ResolveURL/blob/master/script.module.resolveurl/lib/resolveurl/plugins/lulustream.py */
export class LuluStream extends Extractor {
  public readonly id = 'lulustream';

  public readonly label = 'LuluStream (via MediaFlow Proxy)';

  public override viaMediaFlowProxy = true;

  public supports(ctx: Context, url: URL): boolean {
    const supportedDomain = null !== url.host.match(/lulu/)
      || [
        '732eg54de642sa.sbs',
        'cdn1.site',
        'd00ds.site',
        'streamhihi.com',
      ].includes(url.host);

    return supportedDomain && supportsMediaFlowProxy(ctx);
  }

  public override normalize(url: URL): URL {
    const videoId = url.pathname.split('/').slice(-1)[0] as string;

    return new URL(`/e/${videoId}`, url);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const fileUrl = new URL(url.href.replace('/e/', '/d/'));
    const html = await this.fetcher.text(ctx, fileUrl, { headers });

    if (/No such file|File Not Found/.test(html)) {
      throw new NotFoundError();
    }

    const $ = cheerio.load(html);
    const title = $('h1').text().trim();

    const heightAndSizeMatch = html.match(/\d{3,}x(\d{3,}), ([\d.]+ ?[GM]B)/) as string[];

    const playlistUrl = await buildMediaFlowProxyExtractorStreamUrl(ctx, this.fetcher, 'LuluStream', url, headers);

    return [
      {
        url: playlistUrl,
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          title,
          bytes: bytes.parse(heightAndSizeMatch[2] as string) as number,
          height: parseInt(heightAndSizeMatch[1] as string),
        },
      },
    ];
  };
}
