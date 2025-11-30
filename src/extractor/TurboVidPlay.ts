import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import {
  buildMediaFlowProxyExtractorStreamUrl,
  supportsMediaFlowProxy,
} from '../utils';
import { Extractor } from './Extractor';

export class TurboVidPlay extends Extractor {
  public readonly id = 'TurboVidPlay';
  public readonly label = 'TurboVidPlay';
  public override readonly ttl = 10800000;
  public override viaMediaFlowProxy = true;

  private domains = [
    'turboviplay.com',
    'emturbovid.com',
    'tuborstb.co',
    'javggvideo.xyz',
    'stbturbo.xyz',
    'turbovidhls.com',
  ];

  public supports(ctx: Context, url: URL): boolean {
    return (
      this.domains.some(d => url.host.includes(d))
      && supportsMediaFlowProxy(ctx)
    );
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace(/\/(e|d|embed-)\//, '/t/'));
  }

  protected async extractInternal(
    ctx: Context,
    url: URL,
    meta: Meta,
  ): Promise<UrlResult[]> {
    const headers: Record<string, string> = {
      Referer: url.origin,
    };

    const html = await this.fetcher.text(ctx, url, headers);
    if (
      !html
      || html.includes('File Not Found')
      || html.includes('Pending in queue')
    ) {
      throw new NotFoundError();
    }

    // Extract media URL via named capture group
    const match = html.match(
      /(?:urlPlay|data-hash)\s*=\s*['"](?<url>[^"']+)/,
    );

    const groups = match?.groups as Record<string, string> | undefined;
    const mediaUrl = groups?.['url'];

    if (!mediaUrl) {
      throw new NotFoundError('Video link not found');
    }

    const masterUrl
      = mediaUrl.startsWith('//')
        ? `https:${mediaUrl}`
        : mediaUrl.startsWith('/')
          ? url.origin + mediaUrl
          : mediaUrl;

    let directDataStream: string | null = null;

    try {
      const playlistText = await this.fetcher.text(
        ctx,
        new URL(masterUrl),
        headers,
      );

      const variantMatches = [
        ...playlistText.matchAll(/#EXT-X-STREAM-INF[^\n]*\n([^\n]+)/g),
      ];

      for (const m of variantMatches) {
        const variantUrl = m[1];
        if (!variantUrl) continue;

        if (variantUrl.includes('/data/')) {
          const base = new URL(masterUrl);

          directDataStream
            = variantUrl.startsWith('http')
              ? variantUrl
              : variantUrl.startsWith('/')
                ? new URL(variantUrl, base.origin).href
                : new URL(variantUrl, base.href).href;

          break;
        }
      }
    } catch {
      // Ignore playlist parsing errors
    }

    const $ = cheerio.load(html);
    const title = $('title').text().trim() || this.label;

    if (directDataStream) {
      return [
        {
          url: new URL(directDataStream),
          format: Format.hls,
          label: this.label,
          sourceId: `${this.id}_${meta.countryCodes?.join('_') ?? 'all'}`,
          ttl: this.ttl,
          requestHeaders: headers,
          meta: {
            ...meta,
            title,
          },
        },
      ];
    }

    const proxiedUrl = await buildMediaFlowProxyExtractorStreamUrl(
      ctx,
      this.fetcher,
      this.id,
      url,
      headers,
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
          title,
        },
      },
    ];
  }
}
