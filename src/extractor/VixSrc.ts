import { Context, CountryCode, Format, Meta, UrlResult } from '../types';
import {
  buildMediaFlowProxyExtractorStreamUrl, CustomRequestInit, guessHeightFromPlaylist,
  hasMultiEnabled,
  iso639FromCountryCode,
  supportsMediaFlowProxy,
} from '../utils';
import { Extractor } from './Extractor';

export class VixSrc extends Extractor {
  public readonly id = 'vixsrc';

  public readonly label = 'VixSrc (via MediaFlow Proxy)';

  public override viaMediaFlowProxy = true;

  public supports(ctx: Context, url: URL): boolean {
    return null !== url.host.match(/vixsrc/) && supportsMediaFlowProxy(ctx);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const playlistUrl = await buildMediaFlowProxyExtractorStreamUrl(ctx, this.fetcher, 'VixCloud', url);
    const countryCodes = await this.determineCountryCodesFromPlaylist(ctx, playlistUrl, { headers: { Referer: url.href }, queueLimit: 4 });

    if (!hasMultiEnabled(ctx.config) && !countryCodes.some(countryCode => countryCode in ctx.config)) {
      return [];
    }

    return [
      {
        url: playlistUrl,
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          countryCodes,
          height: await guessHeightFromPlaylist(ctx, this.fetcher, playlistUrl, { headers: { Referer: url.href }, queueLimit: 4 }),
        },
      },
    ];
  };

  private async determineCountryCodesFromPlaylist(ctx: Context, playlistUrl: URL, init?: CustomRequestInit): Promise<CountryCode[]> {
    const playlist = await this.fetcher.text(ctx, playlistUrl, init);

    const countryCodes: CountryCode[] = [CountryCode.it];

    (Object.keys(CountryCode) as CountryCode[]).forEach((countryCode) => {
      const iso639 = iso639FromCountryCode(countryCode);

      if (!countryCodes.includes(countryCode) && (new RegExp(`#EXT-X-MEDIA:TYPE=AUDIO.*LANGUAGE="${iso639}"`)).test(playlist)) {
        countryCodes.push(countryCode);
      }
    });

    return countryCodes;
  }
}
