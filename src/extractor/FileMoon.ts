import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import {
  buildMediaFlowProxyExtractorStreamUrl,
  guessHeightFromPlaylist,
  MEDIAFLOW_DEFAULT_INIT,
  supportsMediaFlowProxy,
} from '../utils';
import { Extractor } from './Extractor';

/** @see https://github.com/Gujal00/ResolveURL/blob/master/script.module.resolveurl/lib/resolveurl/plugins/filemoon.py */
export class FileMoon extends Extractor {
  public readonly id = 'filemoon';

  public readonly label = 'FileMoon (via MediaFlow Proxy)';

  public override viaMediaFlowProxy = true;

  public supports(ctx: Context, url: URL): boolean {
    const supportedDomain = null !== url.host.match(/filemoon/)
      || [
        '1azayf9w.xyz',
        '222i8x.lol',
        '81u6xl9d.xyz',
        '8mhlloqo.fun',
        '96ar.com',
        'bf0skv.org',
        'boosteradx.online',
        'c1z39.com',
        'cinegrab.com',
        'f51rm.com',
        'furher.in',
        'kerapoxy.cc',
        'l1afav.net',
        'moonmov.pro',
        'smdfs40r.skin',
        'xcoic.com',
        'z1ekv717.fun',
      ].includes(url.host);

    return supportedDomain && supportsMediaFlowProxy(ctx);
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace('/e/', '/d/'));
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const html = await this.fetcher.text(ctx, url, { headers });

    if (/Page not found/.test(html)) {
      throw new NotFoundError();
    }

    const playlistUrl = await buildMediaFlowProxyExtractorStreamUrl(ctx, this.fetcher, 'FileMoon', url, headers);

    const $ = cheerio.load(html);
    const title = $('h3').text().trim();

    return [
      {
        url: playlistUrl,
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          height: await guessHeightFromPlaylist(ctx, this.fetcher, playlistUrl, MEDIAFLOW_DEFAULT_INIT),
          title,
        },
      },
    ];
  };
}
