import * as cheerio from 'cheerio';
import { Context, CountryCode, Format, UrlResult } from '../types';
import { buildMediaFlowProxyExtractorRedirectUrl, supportsMediaFlowProxy } from '../utils';
import { guessSizeFromMp4 } from '../utils/size';
import { Extractor } from './Extractor';

export class Uqload extends Extractor {
  public readonly id = 'uqload';

  public readonly label = 'Uqload (via MediaFlow Proxy)';

  public override readonly ttl = 0;

  public override viaMediaFlowProxy = true;

  public supports(ctx: Context, url: URL): boolean {
    return null !== url.host.match(/uqload/) && supportsMediaFlowProxy(ctx);
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace('/embed-', '/'));
  }

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> {
    const html = await this.fetcher.text(ctx, url);

    const heightMatch = html.match(/\d{3,}x(\d{3,})/);

    const $ = cheerio.load(html);
    const title = $('h1').text().trim();

    const mp4Url = buildMediaFlowProxyExtractorRedirectUrl(ctx, 'Uqload', url);

    return [
      {
        url: mp4Url,
        format: Format.mp4,
        label: this.label,
        sourceId: `${this.id}_${countryCode}`,
        ttl: this.ttl,
        meta: {
          countryCodes: [countryCode],
          title,
          bytes: await guessSizeFromMp4(ctx, this.fetcher, mp4Url),
          ...(heightMatch && {
            height: parseInt(heightMatch[1] as string),
          }),
        },
      },
    ];
  };
}
