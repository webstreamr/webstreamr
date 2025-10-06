import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import { buildMediaFlowProxyExtractorStreamUrl, guessHeightFromPlaylist, supportsMediaFlowProxy } from '../utils';
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
    return new URL(url.href.replace('/d/', '/e/'));
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const fileUrl = new URL(url.href.replace('/e/', '/d/'));
    const html = await this.fetcher.text(ctx, fileUrl, { headers });

    if (/No such file/.test(html)) {
      throw new NotFoundError();
    }

    const $ = cheerio.load(html);
    const title = $('h1').text().trim();

    const sizeMatch = html.match(/([\d.]+ ?[GM]B)/) as string[];

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
          bytes: bytes.parse(sizeMatch[1] as string) as number,
          height: await guessHeightFromPlaylist(ctx, this.fetcher, playlistUrl, { queueLimit: 4 }),
          title,
        },
      },
    ];
  };
}
