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

  public readonly label = 'Streamtape (via MediaFlow Proxy)';

  public supports(ctx: Context, url: URL): boolean {
    const supportedDomain
    = null !== url.host.match(/streamtape/)
    || [
        'strtape.cloud',
        'streamta.pe',
        'strcloud.link',
        'strcloud.club',
        'strtpe.link',
        'scloud.online',
        'stape.fun',
        'streamadblockplus.com',
        'shavetape.cash',
        'streamta.site',
        'streamadblocker.xyz',
        'tapewithadblock.org',
        'adblocktape.wiki',
        'antiadtape.com',
        'tapeblocker.com',
        'streamnoads.com',
        'tapeadvertisement.com',
        'tapeadsenjoyer.com',
        'watchadsontape.com',
      ].includes(url.host);

    return supportedDomain && supportsMediaFlowProxy(ctx);
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace('/e/', '/v/'));
  }

  protected async extractInternal(
    ctx: Context,
    url: URL,
    meta: Meta,
  ): Promise<UrlResult[]> {
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
          bytes: bytes.parse(sizeMatch[1] as string) as number,
        },
      },
    ];
  }
}
