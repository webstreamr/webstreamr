import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import { buildMediaFlowProxyExtractorRedirectUrl, supportsMediaFlowProxy } from '../utils';
import { Extractor } from './Extractor';

export class Uqload extends Extractor {
  public readonly id = 'uqload';

  public readonly label = 'Uqload';

  public override viaMediaFlowProxy = true;

  public supports(ctx: Context, url: URL): boolean {
    return null !== url.host.match(/uqload/) && supportsMediaFlowProxy(ctx);
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace('/embed-', '/'));
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const html = await this.fetcher.text(ctx, url);

    if (/File Not Found/.test(html)) {
      throw new NotFoundError();
    }

    const heightMatch = html.match(/\d{3,}x(\d{3,})/);

    const $ = cheerio.load(html);
    const title = $('h1').text().trim();

    return [
      {
        url: buildMediaFlowProxyExtractorRedirectUrl(ctx, 'Uqload', url),
        format: Format.mp4,
        label: this.label,
        ttl: this.ttl,
        meta: {
          ...meta,
          title,
          ...(heightMatch && {
            height: parseInt(heightMatch[1] as string),
          }),
        },
      },
    ];
  };
}
