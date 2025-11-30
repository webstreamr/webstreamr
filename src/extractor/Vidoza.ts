import bytes from 'bytes';
import { NotFoundError } from '../error';
import {
  buildMediaFlowProxyExtractorStreamUrl,
  supportsMediaFlowProxy,
} from '../utils';
import { Context, Format, Meta, UrlResult } from '../types';
import { Extractor } from './Extractor';

export class Vidoza extends Extractor {
  public readonly id = 'Vidoza';
  public readonly label = 'Vidoza (via MediaFlow Proxy)';
  public override readonly ttl = 10800000; // 3h
  public override viaMediaFlowProxy = true;

  private domains = ['vidoza.net', 'vidoza.co', 'videzz.net'];

  public supports(ctx: Context, url: URL): boolean {
    return (
      this.domains.some(d => url.host.includes(d))
      && supportsMediaFlowProxy(ctx)
    );
  }

  public override normalize(url: URL): URL {
    const id =
      url.pathname.match(/embed-([A-Za-z0-9]+)\.html?/i)?.[1]
      || url.pathname.match(/\/([A-Za-z0-9]+)\.html?/i)?.[1];

    if (!id) return url;

    return new URL(`https://videzz.net/${id}.html`);
  }

  protected override async extractInternal(
    ctx: Context,
    url: URL,
    meta: Meta,
  ): Promise<UrlResult[]> {
    const headers: Record<string, string> = {
      'Referer': 'https://vidoza.net/',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
    };

    const html = await this.fetcher.text(ctx, url, headers);
    if (!html) throw new NotFoundError('Vidoza: video page unavailable');

    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const title = titleMatch?.[1]?.trim() || this.label;

    let bytesSize: number | null = null;
    const sizeMatch = html.match(/File size:\s*<span>([\d.]+\s*[GM]B)<\/span>/i);

    if (sizeMatch?.[1]) {
      const parsed = bytes.parse(sizeMatch[1]);
      if (parsed !== null) {
        bytesSize = parsed;
      }
    }

    const extractedLabel = this.extractLabelFromHtml(html);
    const height = extractedLabel ? parseInt(extractedLabel, 10) : null;

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
        format: Format.mp4,
        label: this.label,
        ttl: this.ttl,
        requestHeaders: headers,
        sourceId: `${this.id}_${meta.countryCodes?.join('_') ?? 'all'}`,
        meta: {
          ...meta,
          title,
          ...(height !== null ? { height } : {}),
          ...(bytesSize && bytesSize > 16777216 ? { bytes: bytesSize } : {}),
        },
      },
    ];
  }

  private extractLabelFromHtml(html: string): string | null {
    const regex =
      /["']?\s*(?:file|src)\s*["']?\s*[:=,]?\s*["'][^"']+(?:[^}>\]]+)["']?\s*res\s*["']?\s*[:=]\s*["']?(\d{3,4})/i;

    const m =
      html.match(regex);

    return m && m[1] ? m[1] : null;
  }
}
