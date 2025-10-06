import * as cheerio from 'cheerio';
import { Context, Format, Meta, UrlResult } from '../types';
import {
  buildMediaFlowProxyExtractorRedirectUrl, MEDIAFLOW_DEFAULT_INIT,
  supportsMediaFlowProxy,
} from '../utils';
import { guessSizeFromMp4 } from '../utils/size';
import { Extractor } from './Extractor';

export class Streamtape extends Extractor {
  public readonly id = 'streamtape';

  public readonly label = 'Streamtape (via MediaFlow Proxy)';

  public supports(ctx: Context, url: URL): boolean {
    return null !== url.host.match(/streamtape/) && supportsMediaFlowProxy(ctx);
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace('/v/', '/e/'));
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const html = await this.fetcher.text(ctx, url, { headers });

    const $ = cheerio.load(html);
    const title = $('meta[name="og:title"]').attr('content') as string;

    const mp4Url = buildMediaFlowProxyExtractorRedirectUrl(ctx, 'Streamtape', url, headers);

    return [
      {
        url: mp4Url,
        format: Format.mp4,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          title,
          bytes: await guessSizeFromMp4(ctx, this.fetcher, mp4Url, MEDIAFLOW_DEFAULT_INIT),
        },
      },
    ];
  };
}
