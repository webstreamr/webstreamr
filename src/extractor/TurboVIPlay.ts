import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import { Extractor } from './Extractor';
import { guessHeightFromPlaylist } from '../utils/height';

export class TurboVIPlay extends Extractor {
  public readonly id = 'turboviplay';
  public readonly label = 'TurboVIPlay';
  public override readonly ttl: number = 10800000; // 3h

  private domains = [
    'turboviplay.com',
    'emturbovid.com',
    'tuborstb.co',
    'javggvideo.xyz',
    'stbturbo.xyz',
    'turbovidhls.com',
  ];

  public supports(_ctx: Context, url: URL): boolean {
    return this.domains.some((d) => url.host.includes(d));
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace(/\/(e|d|embed-)\//, '/t/'));
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: 'https://turbovidhls.com' };

    const html = await this.fetcher.text(ctx, url, { headers });

    if (!html || html.includes('File Not Found') || html.includes('Pending in queue')) {
      throw new NotFoundError();
    }

    const match = html.match(/(?:urlPlay|data-hash)\s*=\s*['"](?<url>[^"']+)/);
    const mediaUrl = match?.groups?.['url'];
    if (!mediaUrl) {
      throw new NotFoundError('Video link not found');
    }

    let finalUrl = mediaUrl;
    if (finalUrl.startsWith('//')) finalUrl = 'https:' + finalUrl;
    else if (finalUrl.startsWith('/')) finalUrl = url.origin + finalUrl;

    const resolvedUrl = await this.followRedirect(ctx, finalUrl, headers);

    const playableUrl = await this.resolveHlsMaster(ctx, resolvedUrl, headers);

    console.log(`[TurboVIPlay] Final playable URL: ${playableUrl}`);

    let height: number | undefined;
    try {
      height = await guessHeightFromPlaylist(ctx, this.fetcher, new URL(playableUrl), { headers });
    } catch {
      height = undefined;
    }

    const $ = cheerio.load(html);
    const title = $('title').text().trim() || this.label;

    return [
      {
        url: new URL(playableUrl),
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_') ?? 'all'}`,
        ttl: this.ttl,
       requestHeaders: headers,
        meta: {
          ...meta,
          title,
          height,
        },
      },
    ];
  }

  private async followRedirect(ctx: Context, link: string, headers: Record<string, string>): Promise<string> {
    try {
      const resp = await this.fetcher.head(ctx, new URL(link), { headers, redirect: 'follow' });
      if (resp && typeof resp['url'] === 'string') return String(resp['url']);
    } catch {
      try {
        const resp = await this.fetcher.fetch(ctx, new URL(link), { headers, redirect: 'follow' });
        if (resp && typeof resp['url'] === 'string') return String(resp['url']);
      } catch {
        // ignore
      }
    }
    return link;
  }

  private async resolveHlsMaster(ctx: Context, url: string, headers: Record<string, string>): Promise<string> {
    const text = await this.fetcher.text(ctx, new URL(url), { headers });
    if (!text || !text.includes('#EXT-X-STREAM-INF')) return url;

    const matches = Array.from(
      text.matchAll(/#EXT-X-STREAM-INF:.*RESOLUTION=(\d+)x(\d+)[^\n]*\n([^\n]+)/g)
    );

    if (matches.length === 0) return url;

    matches.sort((a, b) => parseInt(b[2] ?? '0', 10) - parseInt(a[2] ?? '0', 10));

    const best = matches[0]?.[3];
    if (!best) return url;

    const base = new URL(url);
    if (best.startsWith('http')) return best;
    if (best.startsWith('/')) return new URL(best, base.origin).href;
    return new URL(best, base.href).href;
  }
}
