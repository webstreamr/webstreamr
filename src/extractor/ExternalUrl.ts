import { Extractor } from './types';
import { Fetcher } from '../utils';
import { Context, Meta } from '../types';

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

  readonly extract = async (ctx: Context, url: URL, meta: Meta) => {
    // We only want to make sure that the URL is accessible
    await this.fetcher.head(ctx, url, { noFlareSolverr: true });

    return [
      {
        url: url,
        isExternal: true,
        label: `${url.host}`,
        sourceId: `${this.id}_${meta.countryCode.toLowerCase()}`,
        ttl: this.ttl,
        meta,
      },
    ];
  };
}
