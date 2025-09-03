import { BlockedError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import { showExternalUrls } from '../utils';
import { Extractor } from './Extractor';

export class ExternalUrl extends Extractor {
  public readonly id = 'external';

  public readonly label = 'External';

  public override readonly ttl = 21600000; // 6h

  public supports(ctx: Context, url: URL): boolean {
    return showExternalUrls(ctx.config) && null !== url.host.match(/.*/);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    try {
      // Make sure the URL is accessible, but avoid causing noise and delays doing this
      await this.fetcher.head(ctx, url, { noFlareSolverr: true, timeout: 1000, headers: { Referer: url.origin } });
    } catch (error) {
      /* istanbul ignore if */
      if (!(error instanceof BlockedError)) {
        return [];
      }
    }

    return [
      {
        url: url,
        format: Format.unknown,
        isExternal: true,
        label: `${url.host}`,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta,
      },
    ];
  };
}
