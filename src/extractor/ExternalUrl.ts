import { Extractor } from './types';
import { Fetcher } from '../utils';
import { Context, CountryCode, UrlResult } from '../types';

export class ExternalUrl implements Extractor {
  readonly id = 'external';

  readonly label = 'External';

  readonly ttl = 3600000; // 1h

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly supports = (ctx: Context, url: URL): boolean => !('excludeExternalUrls' in ctx.config) && null !== url.host.match(/.*/);

  readonly normalize = (url: URL): URL => url;

  readonly extract = async (ctx: Context, url: URL, countryCode: CountryCode, title: string | undefined): Promise<UrlResult[]> => {
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
