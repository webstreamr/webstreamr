import { Context, Format, Meta, UrlResult } from '../types';
import { guessSizeFromMp4 } from '../utils/size';
import { Extractor } from './Extractor';

interface XPrimePrimeboxResponsePartial {
  streams: Record<string, string>;
  series_info?: {
    episode: number;
    season: number;
    title: string;
    year: string;
  };
  title?: string;
}

export class XPrime extends Extractor {
  public readonly id = 'xprime';

  public readonly label = 'XPrime';

  public override readonly ttl: number = 21600000; // 6h

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/xprime/);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const urlResults: UrlResult[] = [];

    const headers = { Referer: meta.referer ?? url.protocol + '//' + url.hostname.split('.').slice(-2).join('.') };

    if (url.href.includes('primebox')) {
      const jsonResponse = JSON.parse(await this.fetcher.text(ctx, url)) as XPrimePrimeboxResponsePartial;

      for (const [resolution, stream] of Object.entries(jsonResponse.streams)) {
        const url = new URL(stream);
        const title = jsonResponse.series_info
          ? `${jsonResponse.series_info.title} ${jsonResponse.series_info.season}x${jsonResponse.series_info.episode} (${jsonResponse.series_info.year})`
          : jsonResponse.title;

        urlResults.push({
          url,
          format: Format.mp4,
          label: `${this.label} Primebox`,
          sourceId: `${this.id}_primebox_${meta.countryCodes?.join('_')}`,
          ttl: this.ttl,
          meta: {
            ...meta,
            bytes: await guessSizeFromMp4(ctx, this.fetcher, url, { headers, minCacheTtl: this.ttl }),
            height: parseInt(resolution),
            title,
          },
          requestHeaders: headers,
        });
      }
    }

    return urlResults;
  };
}
