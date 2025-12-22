import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import { buildMediaFlowProxyExtractorStreamUrl, supportsMediaFlowProxy, unpackEval } from '../utils';
import { Extractor } from './Extractor';

/** @see https://github.com/Gujal00/ResolveURL/commits/master/script.module.resolveurl/lib/resolveurl/plugins/filelions.py */
export class FileLions extends Extractor {
  public readonly id = 'filelions';

  public readonly label = 'FileLions';

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
        'callistanise.com',
        'coolciima.online',
        'dhtpre.com',
        'dingtezuni.com',
        'dintezuvio.com',
        'e4xb5c2xnz.sbs',
        'egsyxutd.sbs',
        'fdewsdc.sbs',
        'gsfomqu.sbs',
        'javplaya.com',
        'katomen.online',
        'lumiawatch.top',
        'minochinos.com',
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
    return new URL(url.href.replace('/v/', '/f/').replace('/download/', '/f/').replace('/file/', '/f/'));
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const html = await this.fetcher.text(ctx, url, { headers });

    if (html.includes('This video can be watched as embed only')) {
      return await this.extractInternal(ctx, new URL(url.href.replace('/f/', '/v/')), meta);
    }

    if (/File Not Found/.test(html)) {
      throw new NotFoundError();
    }

    const unpacked = unpackEval(html);
    const heightMatch = unpacked.match(/(\d{3,})p/) as string[];

    const sizeMatch = html.match(/([\d.]+ ?[GM]B)/);

    const $ = cheerio.load(html);
    const title = $('meta[name="description"]').attr('content') as string;

    return [
      {
        url: await buildMediaFlowProxyExtractorStreamUrl(ctx, this.fetcher, 'FileLions', url, headers),
        format: Format.hls,
        label: this.label,
        ttl: this.ttl,
        meta: {
          ...meta,
          height: parseInt(heightMatch[1] as string),
          ...(sizeMatch && { bytes: bytes.parse(sizeMatch[1] as string) as number }),
          ...(title && { title }),
        },
      },
    ];
  };
}
