import * as cheerio from 'cheerio';
import { Extractor } from './Extractor';
import { buildMediaFlowProxyUrl, Fetcher, hasMediaFlowProxy } from '../utils';
import { Context, CountryCode, Format, UrlResult } from '../types';

export class Uqload extends Extractor {
  public readonly id = 'uqload';

  public readonly label = 'Uqload (via MediaFlow Proxy)';

  public override readonly ttl = 0;

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public supports(ctx: Context, url: URL): boolean {
    return null !== url.host.match(/uqload/) && hasMediaFlowProxy(ctx.config);
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace('/embed-', '/'));
  }

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> {
    const html = await this.fetcher.text(ctx, url);

    const heightMatch = html.match(/\d{3,}x(\d{3,})/);

    const $ = cheerio.load(html);
    const title = $('h1').text().trim();

    return [
      {
        url: buildMediaFlowProxyUrl(ctx.config, 'Uqload', url),
        format: Format.mp4,
        label: this.label,
        sourceId: `${this.id}_${countryCode}`,
        ttl: this.ttl,
        meta: {
          countryCode,
          title,
          ...(heightMatch && {
            height: parseInt(heightMatch[1] as string) as number,
          }),
        },
      },
    ];
  };
}
