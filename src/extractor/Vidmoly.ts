import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import {
  buildMediaFlowProxyExtractorStreamUrl,
  guessHeightFromPlaylist,
  supportsMediaFlowProxy,
} from '../utils';
import { Extractor } from './Extractor';

export class Vidmoly extends Extractor {
  public readonly id = 'Vidmoly';
  public readonly label = 'VidMoly(MFP)';
  public override readonly ttl = 10800000; // 3h
  public override viaMediaFlowProxy = true;

  private domains = ['vidmoly.me', 'vidmoly.to', 'vidmoly.net'];

  public supports(ctx: Context, url: URL): boolean {
    return this.domains.some(d => url.host.includes(d)) && supportsMediaFlowProxy(ctx);
  }

  // Normalize to embed URL
  public override normalize(url: URL): URL {
    let path = url.pathname.replace(/^\/+/, '');
    if (!path.startsWith('embed-')) path = `embed-${path}`;
    if (!path.endsWith('.html')) path += '.html';
    return new URL(`${url.origin}/${path}`);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const referer = meta.referer ?? url.href;
    const headers: Record<string, string> = { Referer: referer };

    // --- 1. Fetch embed page ---
    const embedHtml = await this.fetcher.text(ctx, url, headers);
    if (!embedHtml || embedHtml.includes('Video not found')) throw new NotFoundError();

    // Extract HLS URL
    const sourcesMatch = embedHtml.match(/sources:\s*\[\{file:"(?<url>[^"]+)"/);
    const mediaUrl = sourcesMatch?.groups?.['url'];

    let height: number | undefined;

    if (mediaUrl) {
      const streamUrl = mediaUrl.startsWith('//')
        ? 'https:' + mediaUrl
        : mediaUrl.startsWith('/')
          ? url.origin + mediaUrl
          : mediaUrl;

      try {
        height = await guessHeightFromPlaylist(
          ctx,
          this.fetcher,
          new URL(streamUrl),
          url,
          headers,
        );
      } catch {
        // ignore
      }
    }

    // --- 2. Fetch main page for title ---
    const mainUrl = url.href.replace('embed-', '');
    let title = this.label;

    try {
      const mainHtml = await this.fetcher.text(ctx, new URL(mainUrl), headers);
      const $ = cheerio.load(mainHtml);
      const vidDiv = $('div.vid-d');
      const innerSpan = vidDiv.find('span span').first();
      title = innerSpan.text().trim() || this.label;
      title = title.replace(/\.mp4$/i, '');
    } catch {
      // fallback
    }

    // --- 3. MediaFlow proxy ---
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
        meta: { ...meta, title, height },
      },
    ];
  }
}
