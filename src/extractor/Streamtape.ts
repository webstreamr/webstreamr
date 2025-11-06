import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { Context, Format, Meta, UrlResult } from '../types';
import {
  buildMediaFlowProxyExtractorRedirectUrl,
  supportsMediaFlowProxy,
} from '../utils';
import { Extractor } from './Extractor';

export class Streamtape extends Extractor {
  public readonly id = 'streamtape';
  public readonly label = 'Streamtape(MFP)';

  // ✅ Add the domains list here
  public readonly domains = [
    'streamtape.com', 'strtape.cloud', 'streamtape.net', 'streamta.pe', 'streamtape.site',
    'strcloud.link', 'strcloud.club', 'strtpe.link', 'streamtape.cc', 'scloud.online', 'stape.fun',
    'streamadblockplus.com', 'shavetape.cash', 'streamtape.to', 'streamta.site',
    'streamadblocker.xyz', 'tapewithadblock.org', 'adblocktape.wiki', 'antiadtape.com',
    'streamtape.xyz', 'tapeblocker.com', 'streamnoads.com', 'tapeadvertisement.com',
    'tapeadsenjoyer.com', 'watchadsontape.com'
  ];

  public supports(ctx: Context, url: URL): boolean {
    // ✅ Match any of the known domains dynamically
    const isSupportedDomain = this.domains.some(domain => url.hostname.endsWith(domain));
    return isSupportedDomain && supportsMediaFlowProxy(ctx);
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace('/e/', '/v/'));
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    // Only needed to properly find non-existing files via 404 response
    await this.fetcher.text(ctx, new URL(url.href.replace('/v/', '/e/')), { headers });

    const html = await this.fetcher.text(ctx, url, { headers });

    const sizeMatch = html.match(/([\d.]+ ?[GM]B)/) as string[];
    const $ = cheerio.load(html);
    const title = $('meta[name="og:title"]').attr('content') as string;

    return [
      {
        url: buildMediaFlowProxyExtractorRedirectUrl(ctx, 'Streamtape', url, headers),
        format: Format.mp4,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          title,
          bytes: bytes.parse(sizeMatch?.[1] ?? '0') as number,
        },
      },
    ];
  };
}