import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { Context, Format, Meta, UrlResult } from '../types';
import {
  buildMediaFlowProxyExtractorStreamUrl,
  guessHeightFromPlaylist,
  MEDIAFLOW_DEFAULT_INIT,
  supportsMediaFlowProxy,
} from '../utils';
import { Extractor } from './Extractor';

/** @see https://github.com/Gujal00/ResolveURL/commits/master/script.module.resolveurl/lib/resolveurl/plugins/filelions.py */
export class FileLions extends Extractor {
  public readonly id = 'filelions';

  public readonly label = 'FileLions (via MediaFlow Proxy)';

  public override viaMediaFlowProxy = true;

  public supports(ctx: Context, url: URL): boolean {
    const supportedDomain = null !== url.host.match(/.*lions?/)
      || [
        '6sfkrspw4u.sbs',
        'ajmidyadfihayh.sbs',
        'alhayabambi.sbs',
        'anime7u.com',
        'azipcdn.com',
        'bingezove.com',
        'coolciima.online',
        'dhtpre.com',
        'e4xb5c2xnz.sbs',
        'egsyxutd.sbs',
        'fdewsdc.sbs',
        'gsfomqu.sbs',
        'javplaya.com',
        'katomen.online',
        'kinoger.be',
        'lumiawatch.top',
        'mivalyo.com',
        'moflix-stream.click',
        'motvy55.store',
        'movearnpre.com',
        'peytonepre.com',
        'ryderjet.com',
        'smoothpre.com',
        'taylorplayer.com',
        'techradar.ink',
        'videoland.sbs',
        'vidhide.com',
        'vidhide.fun',
        'vidhidefast.com',
        'vidhidehub.com',
        'vidhideplus.com',
        'vidhidepre.com',
        'vidhidepro.com',
        'vidhidevip.com',
      ].includes(url.host);

    return supportedDomain && supportsMediaFlowProxy(ctx);
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace('/f/', '/v/').replace('/download/', '/v/').replace('/file/', '/v/'));
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const playlistUrl = await buildMediaFlowProxyExtractorStreamUrl(ctx, this.fetcher, 'FileLions', url, headers);

    const fileUrl = new URL(url.href.replace('/v/', '/f/'));
    const html = await this.fetcher.text(ctx, fileUrl, { headers });

    const sizeMatch = html.match(/([\d.]+ ?[GM]B)/);

    const $ = cheerio.load(html);
    const title = $('title').text().trim().replace(/^Watch /, '').trim();

    return [
      {
        url: playlistUrl,
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          height: await guessHeightFromPlaylist(ctx, this.fetcher, playlistUrl, { ...MEDIAFLOW_DEFAULT_INIT, headers: { Referer: url.href } }),
          ...(sizeMatch && {
            bytes: bytes.parse(sizeMatch[1] as string) as number,
          }),
          ...(title && { title }),
        },
      },
    ];
  };
}
