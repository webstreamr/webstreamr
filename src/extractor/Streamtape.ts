import * as cheerio from 'cheerio';
import { Context, CountryCode, Format, UrlResult } from '../types';
import {
  buildMediaFlowProxyExtractorRedirectUrl,
  supportsMediaFlowProxy,
} from '../utils';
import { guessSizeFromMp4 } from '../utils/size';
import { Extractor } from './Extractor';

export class Streamtape extends Extractor {
  public readonly id = 'streamtape';

  public readonly label = 'Streamtape (via MediaFlow Proxy)';

  public override readonly ttl = 0;

  public override viaMediaFlowProxy = true;

  public supports(ctx: Context, url: URL): boolean {
    return null !== url.host.match(/streamtape/) && supportsMediaFlowProxy(ctx);
  }

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> {
    const html = await this.fetcher.text(ctx, url);

    const $ = cheerio.load(html);
    const title = $('meta[name="og:title"]').attr('content') as string;

    const mp4Url = buildMediaFlowProxyExtractorRedirectUrl(ctx, 'Streamtape', url);

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
        },
      },
    ];
  };
}
