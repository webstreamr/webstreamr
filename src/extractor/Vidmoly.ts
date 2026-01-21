import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import {
  buildMediaFlowProxyExtractorStreamUrl,
  guessHeightFromPlaylist,
  supportsMediaFlowProxy,
} from '../utils';
import { Extractor } from './Extractor';

interface VidmolyTrack {
  file: string;
  kind?: string;
}

interface VidmolySetup {
  tracks?: VidmolyTrack[];
}

export class Vidmoly extends Extractor {
  public readonly id = 'Vidmoly';
  public readonly label = 'VidMoly(MFP)';
  public override readonly ttl = 10800000;
  public override viaMediaFlowProxy = true;

  private domains = ['vidmoly.me', 'vidmoly.to', 'vidmoly.net'];

  public supports(ctx: Context, url: URL): boolean {
    return this.domains.some(d => url.host.includes(d))
      && supportsMediaFlowProxy(ctx);
  }

  public override normalize(url: URL): URL {
    let path = url.pathname.replace(/^\/+/, '');
    if (!path.startsWith('embed-')) path = `embed-${path}`;
    if (!path.endsWith('.html')) path += '.html';
    return new URL(`${url.origin}/${path}`);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const referer = meta.referer ?? url.href;
    const headers: Record<string, string> = { Referer: referer };

    let embedHtml: string;
    try {
      embedHtml = await this.fetcher.text(ctx, url, headers);
    } catch {
      throw new NotFoundError('Vidmoly: embed not responding');
    }

    if (!embedHtml) {
      throw new NotFoundError('Vidmoly: empty embed');
    }

    if (
      (embedHtml.includes('staticmoly') && embedHtml.includes('notice'))
      || embedHtml.includes('Video not found')
    ) {
      throw new NotFoundError('Vidmoly: video removed');
    }

    let subtitles: string[] = [];
    const setupMatch = embedHtml.match(/player\.setup\((\{[\s\S]+?\})\);/);

    if (setupMatch?.[1]) {
      try {
        const jsonText = setupMatch[1]
          .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
          .replace(/'/g, '"');

        const setup: VidmolySetup = JSON.parse(jsonText);

        if (setup.tracks?.length) {
          subtitles = setup.tracks
            .filter(t => t.kind === 'captions' && t.file)
            .map((t) => {
              const urlObj = new URL(t.file, url.origin);
              urlObj.host = 'vidmoly.net';
              return urlObj.href;
            });
        }
      } catch {
        // ignore malformed setup JSON
      }
    }

    const mainUrl = new URL(url.href.replace('embed-', ''));
    let title = meta.title;
    let height: number | undefined;

    try {
      const mainHtml = await this.fetcher.text(ctx, mainUrl, headers);
      const $ = cheerio.load(mainHtml);

      const titleSpan = $('span')
        .filter((_, el) => $(el).text().includes('.mp4'))
        .first();

      if (titleSpan.length > 0) {
        const rawText = titleSpan.text().trim();
        if (rawText) title = rawText.replace(/\.mp4$/i, '');
      }

      if (!height) {
        const fallback = $('body').text().match(/\b(360p|480p|720p|1080p)\b/i);
        if (fallback?.[1]) {
          height = parseInt(fallback[1], 10);
        }
      }
    } catch {
      // ignore main page errors
    }

    const proxiedUrl = await buildMediaFlowProxyExtractorStreamUrl(
      ctx,
      this.fetcher,
      this.id,
      url,
      headers,
    );

    if (!height) {
      try {
        height = await guessHeightFromPlaylist(
          ctx,
          this.fetcher,
          proxiedUrl,
          { headers },
        );
      } catch {
        // ignore playlist probing errors
      }
    }

    return [{
      url: proxiedUrl,
      format: Format.hls,
      label: this.label,
      sourceId: `${this.id}_${meta.countryCodes?.join('_') ?? 'all'}`,
      ttl: this.ttl,
      requestHeaders: headers,
      meta: {
        ...meta,
        title,
        height,
        subtitles,
      },
    }];
  }
}
