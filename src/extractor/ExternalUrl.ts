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

  protected async extractInternal(_ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    return [
      {
        url: url,
        format: Format.unknown,
        isExternal: true,
        label: `${url.host}`,
        ttl: this.ttl,
        meta,
      },
    ];
  };
}
