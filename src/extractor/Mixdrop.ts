import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { Extractor } from './Extractor';
import { buildMediaFlowProxyExtractorRedirectUrl, Fetcher, guessHeightFromTitle, supportsMediaFlowProxy } from '../utils';
import { Context, CountryCode, Format, UrlResult } from '../types';
import { NotFoundError } from '../error';

export class Mixdrop extends Extractor {
  public readonly id = 'mixdrop';

  public readonly label = 'Mixdrop (via MediaFlow Proxy)';

  public override readonly ttl = 0;

  public override viaMediaFlowProxy = true;

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public supports(ctx: Context, url: URL): boolean {
    return null !== url.host.match(/mixdrop/) && supportsMediaFlowProxy(ctx);
  }

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> {
    const fileUrl = new URL(url.href.replace('/e/', '/f/'));
    const html = await this.fetcher.text(ctx, fileUrl);

    if (/can't find the (file|video)/.test(html)) {
      throw new NotFoundError();
    }

    const sizeMatch = html.match(/([\d.,]+ ?[GM]B)/);

    const $ = cheerio.load(html);
    const title = $('.title b').text().trim();

    return [
      {
        url: buildMediaFlowProxyExtractorRedirectUrl(ctx, 'Mixdrop', url),
        format: Format.mp4,
        label: this.label,
        sourceId: `${this.id}_${countryCode}`,
        ttl: this.ttl,
        meta: {
          countryCodes: [countryCode],
          height: guessHeightFromTitle(title),
          title,
          ...(sizeMatch && {
            bytes: bytes.parse((sizeMatch[1] as string).replace(',', '')) as number,
          }),
        },
      },
    ];
  };
}
