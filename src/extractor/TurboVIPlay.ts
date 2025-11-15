import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import { Extractor } from './Extractor';
import { guessHeightFromPlaylist } from '../utils/height';

export class TurboVIPlay extends Extractor {
  public readonly id = 'turboviplay';
  public readonly label = 'TurboVIPlay';
  public override readonly ttl = 10800000; // 3h

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
  const headers: Record<string, string> = { Referer: url.origin };


  // Fetch HTML page
  const html = await this.fetcher.text(ctx, url, headers);
  if (!html || html.includes('File Not Found') || html.includes('Pending in queue')) {
    throw new NotFoundError();
  }

  // Extract media URL
  const match = html.match(/(?:urlPlay|data-hash)\s*=\s*['"](?<url>[^"']+)/);
  const mediaUrl = match?.groups?.['url'];
  if (!mediaUrl) throw new NotFoundError('Video link not found');

  // Normalize URL
  const masterUrl = mediaUrl.startsWith('//')
    ? 'https:' + mediaUrl
    : mediaUrl.startsWith('/')
      ? url.origin + mediaUrl
      : mediaUrl;

  let hlsUrl = masterUrl;

  // Parse master playlist to pick highest resolution variant
  try {
    const playlistText = await this.fetcher.text(ctx, new URL(masterUrl), headers);

    if (playlistText.includes('#EXT-X-STREAM-INF')) {
      const variants = Array.from(
        playlistText.matchAll(/#EXT-X-STREAM-INF:.*RESOLUTION=(\d+)x(\d+)[^\n]*\n([^\n]+)/g)
      );

      if (variants.length) {
        // Sort by height descending
        variants.sort((a, b) => parseInt(b[2] ?? '0', 10) - parseInt(a[2] ?? '0', 10));
        const best = variants[0]?.[3];

        if (best) {
          const base = new URL(masterUrl);
          hlsUrl = best.startsWith('http')
            ? best
            : best.startsWith('/')
              ? new URL(best, base.origin).href
              : new URL(best, base.href).href;
        }
      }
    }
  } catch {
    // fallback to masterUrl
  }

  // Guess height from master playlist
  let height: number | undefined;
  try {
    height = await guessHeightFromPlaylist(ctx, this.fetcher, new URL(masterUrl), new URL(masterUrl), headers);
  } catch {
    // ignore
  }

  // Extract title
  const $ = cheerio.load(html);
  const title = $('title').text().trim() || this.label;

  return [{
    url: new URL(hlsUrl),
    format: Format.hls,
    label: this.label,
    sourceId: `${this.id}_${meta.countryCodes?.join('_') ?? 'all'}`,
    ttl: this.ttl,
    requestHeaders: headers,
    meta: { ...meta, title, height },
  }];
}
}