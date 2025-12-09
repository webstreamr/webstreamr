import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import {
  buildMediaFlowProxyExtractorStreamUrl,
  supportsMediaFlowProxy,
} from '../utils';
import { Extractor } from './Extractor';

/** @see https://github.com/Gujal00/ResolveURL/blob/master/script.module.resolveurl/lib/resolveurl/plugins/tuboviplay.py */
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

    // ---- 1. Fetch embed HTML ----
    const html = await this.fetcher.text(ctx, url, headers);
    if (
      !html
      || html.includes('File Not Found')
      || html.includes('Pending in queue')
    ) {
      throw new NotFoundError();
    }

    // ---- 2. Extract media URL via named capture group ----
    const match = html.match(
      /(?:urlPlay|data-hash)\s*=\s*['"](?<url>[^"']+)/,
    );

    const groups = match?.groups as Record<string, string> | undefined;
    const mediaUrl = groups?.['url'];

    if (!mediaUrl) {
      throw new NotFoundError('Video link not found');
    }

    // ---- 3. Build master playlist URL ----
    const masterUrl =
      mediaUrl.startsWith('//')
        ? `https:${mediaUrl}`
        : mediaUrl.startsWith('/')
          ? url.origin + mediaUrl
          : mediaUrl;

    // ---- 4. Parse playlist → height + /data/ direct stream ----
    let directDataStream: string | null = null;
    let height: number | undefined;

    try {
      const playlistText = await this.fetcher.text(
        ctx,
        new URL(masterUrl),
        headers,
      );

      const variants = playlistText.matchAll(
        /#EXT-X-STREAM-INF:([^\n]+)\n([^\n]+)/g,
      );

      for (const v of variants) {
        const attrs = v[1];
        const variantUrl = v[2];
        if (!attrs || !variantUrl) continue;

        // Always attempt to extract height (max height wins)
        const resMatch = attrs.match(/RESOLUTION=\d+x(\d+)/);
        if (resMatch) {
          const h = Number(resMatch[1]);
          if (!height || h > height) {
            height = h;
          }
        }

        // Decide if direct playback possible (first /data/ wins)
        if (!directDataStream && variantUrl.includes('/data/')) {
          const base = new URL(masterUrl);
          directDataStream =
            variantUrl.startsWith('http')
              ? variantUrl
              : variantUrl.startsWith('/')
                ? new URL(variantUrl, base.origin).href
                : new URL(variantUrl, base.href).href;
        }
      }
    } catch {
      // Ignore playlist parsing errors → fallback to MediaFlow only
    }

    // ---- 5. Title ----
    const $ = cheerio.load(html);
    const title = $('title').text().trim() || this.label;

    // ---- 6. Direct play if /data/ available ----
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
            height,
            title,
          },
        },
      ];
    }

    // ---- 7. MediaFlow proxy fallback ----
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
          height,
          title,
        },
      },
    ];
  }
}
