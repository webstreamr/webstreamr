import bytes from 'bytes';
import { Extractor } from './Extractor';
import { Fetcher, buildMediaFlowProxyExtractorStreamUrl, supportsMediaFlowProxy } from '../utils';
import { Context, CountryCode, Format, UrlResult } from '../types';

export class VixSrc extends Extractor {
  public readonly id = 'vixsrc';

  public readonly label = 'VixSrc (via MediaFlow Proxy)';

  public override readonly ttl = 0;

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public supports(ctx: Context, url: URL): boolean {
    return null !== url.host.match(/vixsrc/) && supportsMediaFlowProxy(ctx);
  }

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> {
    const html = await this.fetcher.text(ctx, url);

    const filenameMatch = html.match(/"filename":"(.*?)"/);
    const sizeMatch = html.match(/"size":(\d+)/);
    const qualityMatch = html.match(/"quality":(\d+)/);

    return [
      {
        url: await buildMediaFlowProxyExtractorStreamUrl(ctx, this.fetcher, 'VixCloud', url),
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${countryCode}`,
        ttl: this.ttl,
        meta: {
          countryCode,
          ...(filenameMatch && { title: filenameMatch[1] }),
          ...(sizeMatch && { bytes: bytes.parse(`${sizeMatch[1]} kb`) as number }),
          ...(qualityMatch && { height: parseInt(qualityMatch[1] as string) }),
        },
      },
    ];
  };
}
