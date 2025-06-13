import { Extractor } from './Extractor';
import { Fetcher, showExternalUrls } from '../utils';
import { Context, CountryCode, UrlResult } from '../types';

export class ExternalUrl extends Extractor {
  public readonly id = 'external';

  public readonly label = 'External';

  public override readonly ttl = 3600000; // 1h

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public supports(ctx: Context, url: URL): boolean {
    return showExternalUrls(ctx.config) && null !== url.host.match(/.*/);
  }

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode, title: string | undefined): Promise<UrlResult[]> {
    try {
      // Make sure the URL is accessible, but avoid causing noise and delays doing this
      await this.fetcher.head(ctx, url, { noFlareSolverr: true, timeout: 1000 });
    } catch {
      return [];
    }

    return [
      {
        url: url,
        isExternal: true,
        label: `${url.host}`,
        sourceId: `${this.id}_${countryCode}`,
        ttl: this.ttl,
        meta: {
          countryCode,
          ...(title && { title }),
        },
      },
    ];
  };
}
