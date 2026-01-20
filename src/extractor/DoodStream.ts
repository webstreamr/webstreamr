import { Context, Format, Meta, UrlResult } from '../types';
import { Extractor } from './Extractor';
import { NotFoundError } from '../error';
import {
  buildMediaFlowProxyExtractorStreamUrl,
  supportsMediaFlowProxy,
} from '../utils';

export class DoodStream extends Extractor {
  public readonly id = 'doodstream';
  public readonly label = 'Dood(MFP)';
  public override readonly ttl = 6 * 60 * 60 * 1000; // 6h

  public override viaMediaFlowProxy = true;

  public supports(ctx: Context, url: URL): boolean {
    const supportedDomain =
      /dood|do[0-9]go|doood|dooood|ds2play|ds2video|dsvplay|d0o0d|do0od|d0000d|d000d|myvidplay|vidply|all3do|doply|vide0|vvide0|d-s/.test(
        url.host
      );

    return supportedDomain && supportsMediaFlowProxy(ctx);
  }

  public override normalize(url: URL): URL {
    const id = url.pathname.replace(/\/+$/, '').split('/').pop();
    if (!id) throw new NotFoundError('Dood: invalid URL');

    return new URL(`https://dood.to/e/${id}`);
  }

  protected async extractInternal(
    ctx: Context,
    url: URL,
    meta: Meta
  ): Promise<UrlResult[]> {

    const headers = {
      Referer: meta.referer ?? url.href,
    };

    const streamUrl =
      await buildMediaFlowProxyExtractorStreamUrl(
        ctx,
        this.fetcher,
        'Doodstream',
        url,
        headers
      );

    return [
      {
        url: streamUrl,
        format: Format.mp4,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta,
      },
    ];
  }
}
