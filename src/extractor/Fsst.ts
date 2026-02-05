import { Context, Format, Meta, UrlResult } from '../types';
import { Extractor } from './Extractor';

export class Fsst extends Extractor {
  public readonly id = 'fsst';
  public readonly label = 'Fsst';
  public override readonly ttl = 10800000; // 3h

  private domains = ['fsst.online', 'secvideo1.online'];

  public supports(_ctx: Context, url: URL): boolean {
    return this.domains.some(d => url.host.includes(d));
  }

  public override normalize(url: URL): URL {
    if (url.host.includes('fsst.online')) {
      return new URL(url.href.replace('fsst.online', 'secvideo1.online'));
    }
    return url;
  }

 protected async extractInternal(
  ctx: Context,
  url: URL,
  meta: Meta
): Promise<UrlResult[]> {
  const headers: Record<string, string> = { Referer: meta.referer ?? url.href };

  const html = await this.fetcher.text(ctx, url, { headers });

  let title = this.label;
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].trim();
  }

  const fileMatch = html.match(/file\s*:\s*"(.*?)"/);
  if (!fileMatch || !fileMatch[1]) return [];

  const filesRaw = fileMatch[1].split(',').map(f => {
    const m = f.match(/\[([0-9]+)p\](.+)/);
    if (!m) return null;

    const heightStr = m[1];
    const link = m[2];
    if (!heightStr || !link) return null;

    return { height: parseInt(heightStr, 10), url: link };
  });

  const files: { height: number; url: string }[] = filesRaw.filter(
    (f): f is { height: number; url: string } => f !== null
  );

  if (files.length === 0) return [];

  const best = files.reduce((prev, curr) =>
    curr.height > prev.height ? curr : prev
  );

  return [
    {
      url: new URL(best.url),
      format: Format.mp4,
      label: this.label,
      sourceId: `${this.id}_${meta.countryCodes?.join('_') ?? 'all'}`,
      requestHeaders: headers,
      ttl: this.ttl,
      meta: {
        ...meta,
        height: best.height,
        title,
      },
    },
  ];
 }
}
