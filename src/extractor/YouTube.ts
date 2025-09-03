import { Context, Format, Meta, UrlResult } from '../types';
import { Extractor } from './Extractor';

export class YouTube extends Extractor {
  public readonly id = 'youtube';

  public readonly label = 'YouTube';

  public override readonly ttl: number = 21600000; // 6h

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/youtube/) && url.searchParams.has('v');
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const html = await this.fetcher.text(ctx, url);

    const titleMatch = html.match(/"title":{"runs":\[{"text":"(.*?)"/) as string[];

    return [
      {
        url,
        format: Format.unknown,
        ytId: url.searchParams.get('v') as string,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          title: titleMatch[1] as string,
        },
      },
    ];
  };
}
