import bytes from 'bytes';
import { Extractor } from './Extractor';
import {
  buildMediaFlowProxyExtractorStreamUrl,
  Fetcher,
  getCountryCodes,
  iso639FromCountryCode,
  supportsMediaFlowProxy,
} from '../utils';
import { Context, CountryCode, Format, UrlResult } from '../types';

export class VixSrc extends Extractor {
  public readonly id = 'vixsrc';

  public readonly label = 'VixSrc (via MediaFlow Proxy)';

  public override readonly ttl = 0;

  public override viaMediaFlowProxy = true;

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

    const playlistUrl = await buildMediaFlowProxyExtractorStreamUrl(ctx, this.fetcher, 'VixCloud', url);
    const countryCodes = await this.determineCountryCodesFromPlaylist(ctx, playlistUrl);

    if (!countryCodes.some(countryCode => countryCode in ctx.config)) {
      return [];
    }

    return [
      {
        url: playlistUrl,
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${countryCode}`,
        ttl: this.ttl,
        meta: {
          countryCodes,
          ...(filenameMatch && { title: filenameMatch[1] }),
          ...(sizeMatch && { bytes: bytes.parse(`${sizeMatch[1]} kb`) as number }),
          ...(qualityMatch && { height: parseInt(qualityMatch[1] as string) }),
        },
      },
    ];
  };

  private async determineCountryCodesFromPlaylist(ctx: Context, playlistUrl: URL): Promise<CountryCode[]> {
    const playlist = await this.fetcher.text(ctx, playlistUrl);

    const countryCodes: CountryCode[] = [CountryCode.it];

    getCountryCodes(ctx.config).forEach((countryCode) => {
      const iso639 = iso639FromCountryCode(countryCode);

      if (!countryCodes.includes(countryCode) && (new RegExp(`#EXT-X-MEDIA:TYPE=AUDIO.*LANGUAGE="${iso639}"`)).test(playlist)) {
        countryCodes.push(countryCode);
      }
    });

    return countryCodes;
  }
}
