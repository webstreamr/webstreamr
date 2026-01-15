import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import {
  buildMediaFlowProxyExtractorStreamUrl,
  guessHeightFromPlaylist,
  supportsMediaFlowProxy,
} from '../utils';
import { Extractor } from './Extractor';

export class F16Px extends Extractor {
  public readonly id = 'F16Px';

  public readonly label = 'F16Px(MFP)';

  public override readonly ttl = 10800000;

  public override viaMediaFlowProxy = true;

  private domains = ['f16px.com', 'filemoon', 'byse'];

  public supports(ctx: Context, url: URL): boolean {
    return this.domains.some(d => url.host.includes(d))
      && supportsMediaFlowProxy(ctx);
  }

  public override normalize(url: URL): URL {
    const match = url.pathname.match(/\/e\/([A-Za-z0-9]+)/);

    if (!match) {
      return url;
    }

    return new URL(`${url.origin}/e/${match[1]}`);
  }

  protected async extractInternal(
    ctx: Context,
    url: URL,
    meta: Meta,
  ): Promise<UrlResult[]> {
    const headers: Record<string, string> = {};

    if (!this.domains.some(d => (meta.referer ?? '').includes(d))) {
      headers.Referer = meta.referer ?? `${url.origin}/`;
    }

    const embedCheck = await this.fetcher.text(ctx, url, headers);

    if (!embedCheck || embedCheck.includes('Video not found')) {
      throw new NotFoundError();
    }

    let title = this.label;

    try {
      const idMatch = url.pathname.match(/\/e\/([A-Za-z0-9]+)/);

      if (idMatch) {
        const detailsUrl = new URL(
          `/api/videos/${idMatch[1]}/embed/details`,
          url.origin,
        );

        const details = await this.fetcher.json(ctx, detailsUrl, headers);

        if (details?.title) {
          title = details.title;
        }
      }
    } catch {
      // Ignore metadata fetch failures
    }

    const proxiedUrl = await buildMediaFlowProxyExtractorStreamUrl(
      ctx,
      this.fetcher,
      this.id,
      url,
      headers,
    );

    const height = await guessHeightFromPlaylist(
      ctx,
      this.fetcher,
      proxiedUrl,
      url,
    );

    return [
      {
        url: proxiedUrl,
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_') ?? 'all'}`,
        ttl: this.ttl,
        requestHeaders: headers,
        meta: {
          ...meta,
          height,
          title,
        },
      },
    ];
  }
}
