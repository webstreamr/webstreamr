import * as cheerio from 'cheerio';
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
  // Fetch HTML page
  const html = await this.fetcher.text(ctx, url);

  // Extract media URL from page
  const match = html.match(/(?:urlPlay|data-hash)\s*=\s*['"](?<url>[^"']+)/);
  const mediaUrl = match?.groups?.['url'];
  if (!mediaUrl) {
    throw new Error('Video link not found');
  }

  // Normalize URL
  let finalUrl = mediaUrl;
  if (finalUrl.startsWith('//')) finalUrl = 'https:' + finalUrl;
  else if (finalUrl.startsWith('/')) finalUrl = url.origin + finalUrl;

  // Try to resolve redirect inline
  try {
    const resp = await this.fetcher.fetch(ctx, new URL(finalUrl));
    if (resp?.url) finalUrl = resp.url;
  } catch {
    // fallback to original finalUrl
  }

  // Optionally guess height from playlist
  let height: number | undefined;
  try {
    height = await guessHeightFromPlaylist(ctx, this.fetcher, new URL(finalUrl));
  } catch {
    height = undefined;
  }

  // Extract title
  const $ = cheerio.load(html);
  const title = $('title').text().trim() || this.label;

  return [
    {
      url: new URL(finalUrl),
      format: Format.hls,
      label: this.label,
      sourceId: `${this.id}_${meta.countryCodes?.join('_') ?? 'all'}`,
      ttl: this.ttl,
      requestHeaders: { Referer: url.origin },
      meta: {
        ...meta,
        title,
        height,
      },
    },
  ];
}
}