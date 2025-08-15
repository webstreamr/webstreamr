import { Context, CountryCode, Format, UrlResult } from '../types';
import { Fetcher } from '../utils';
import { Extractor } from './Extractor';

interface XPrimePrimeboxResponsePartial {
  streams: Record<string, string>;
}

export class XPrime extends Extractor {
  public readonly id = 'xprime';

  public readonly label = 'XPrime';

  public override readonly ttl: number = 10800000; // 3h

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/xprime/);
  }

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode, title: string | undefined): Promise<UrlResult[]> {
    const urlResults: UrlResult[] = [];

    const referer = url.protocol + '//' + url.hostname.split('.').slice(-2).join('.'); // Strip subdomains

    if (url.href.includes('primebox')) {
      const jsonResponse = JSON.parse(await this.fetcher.text(ctx, url)) as XPrimePrimeboxResponsePartial;

      for (const [resolution, stream] of Object.entries(jsonResponse.streams)) {
        const url = new URL(stream);

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
            title: `${title}`,
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
