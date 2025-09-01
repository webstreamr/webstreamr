import { Context, CountryCode, Format, UrlResult } from '../types';
import { Extractor } from './Extractor';

export class YouTube extends Extractor {
  public readonly id = 'youtube';

  public readonly label = 'YouTube';

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/youtube/) && url.searchParams.has('v');
  }

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> {
    const html = await this.fetcher.text(ctx, url);

    const titleMatch = html.match(/"title":{"runs":\[{"text":"(.*?)"/) as string[];

    return [
      {
        url,
        format: Format.unknown,
        ytId: url.searchParams.get('v') as string,
        label: this.label,
        sourceId: `${this.id}_${countryCode}`,
        ttl: this.ttl,
        meta: {
          countryCodes: [countryCode],
          title: titleMatch[1] as string,
        },
      },
    ];
  };
}
