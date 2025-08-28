import { Context, CountryCode, Format, UrlResult } from '../types';
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

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/xprime/);
  }

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> {
    const urlResults: UrlResult[] = [];

    const referer = url.protocol + '//' + url.hostname.split('.').slice(-2).join('.'); // Strip subdomains

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
          sourceId: `${this.id}_${countryCode}_primebox`,
          ttl: this.ttl,
          meta: {
            countryCodes: [countryCode],
            bytes: parseInt((await this.fetcher.head(ctx, url, { headers: { Referer: referer }, minCacheTtl: this.ttl }))['content-length'] as string),
            height: parseInt(resolution),
            title,
          },
          requestHeaders: {
            Referer: referer,
          },
        });
      }
    }

    return urlResults;
  };
}
