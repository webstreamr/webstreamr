import { Extractor } from './types';
import { Fetcher } from '../utils';
import { Context } from '../types';

export class ExternalUrl implements Extractor {
  readonly id = 'external';

  readonly label = 'External';

  readonly ttl = 3600000; // 1h

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly supports = (url: URL): boolean => null !== url.host.match(/.*/);

  readonly extract = async (ctx: Context, url: URL, countryCode: string) => {
    // We only want to make sure that the URL is accessible
    await this.fetcher.head(ctx, url);

    return {
      url: url,
      isExternal: true,
      label: `${url.host}`,
      sourceId: `${this.id}_${countryCode.toLowerCase()}`,
      height: 0,
      bytes: 0,
      countryCode,
    };
  };
}
