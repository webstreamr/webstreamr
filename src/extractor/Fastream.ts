import { Context, CountryCode, Format, UrlResult } from '../types';
import { buildMediaFlowProxyExtractorStreamUrl, Fetcher, guessHeightFromPlaylist, supportsMediaFlowProxy } from '../utils';
import { Extractor } from './Extractor';

export class Fastream extends Extractor {
  public readonly id = 'fastream';

  public readonly label = 'Fastream (via MediaFlow Proxy)';

  public override readonly ttl = 0;

  public override viaMediaFlowProxy = true;

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public supports(ctx: Context, url: URL): boolean {
    return null !== url.host.match(/fastream/) && supportsMediaFlowProxy(ctx);
  }

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> {
    const playlistUrl = await buildMediaFlowProxyExtractorStreamUrl(ctx, this.fetcher, 'Fastream', url);

    return [
      {
        url: playlistUrl,
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${countryCode}`,
        ttl: this.ttl,
        meta: {
          countryCodes: [countryCode],
          height: await guessHeightFromPlaylist(ctx, this.fetcher, playlistUrl),
        },
      },
    ];
  };
}
