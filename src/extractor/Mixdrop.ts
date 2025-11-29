import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import { buildMediaFlowProxyExtractorRedirectUrl, supportsMediaFlowProxy } from '../utils';
import { Extractor } from './Extractor';

export class Mixdrop extends Extractor {
  public readonly id = 'mixdrop';

  public readonly label = 'Mixdrop (MFP)';

  public override viaMediaFlowProxy = true;

  public supports(ctx: Context, url: URL): boolean {
    return null !== url.host.match(/mixdrop/) && supportsMediaFlowProxy(ctx);
  }

  public override readonly normalize = (url: URL): URL => new URL(url.href.replace('/f/', '/e/'));

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const fileUrl = new URL(url.href.replace('/e/', '/f/'));
    const html = await this.fetcher.text(ctx, fileUrl);

    if (/can't find the (file|video)/.test(html)) {
      throw new NotFoundError();
    }

    const sizeMatch = html.match(/([\d.,]+ ?[GM]B)/) as string[];

    const $ = cheerio.load(html);
    const title = $('.title b').text().trim();

    return [
      {
        url: buildMediaFlowProxyExtractorRedirectUrl(ctx, 'Mixdrop', url),
        format: Format.mp4,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          bytes: bytes.parse((sizeMatch[1] as string).replace(',', '')) as number,
          title,
        },
      },
    ];
  };
}
