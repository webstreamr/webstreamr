import { Context, Format, Meta, UrlResult } from '../types';
import { guessHeightFromPlaylist } from '../utils';
import { Extractor } from './Extractor';

interface SoaperInfoResponsePartial {
  val: string;
  val_bak: string;
}

export class Soaper extends Extractor {
  public readonly id = 'soaper';

  public readonly label = 'Soaper';

  public override readonly ttl: number = 43200000; // 12h

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/soaper/) && null !== url.pathname.match(/^\/(episode|movie)_/);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const movieOrEpisodeId = (url.pathname.match(/\/\w+_(\w+)/) as string[])[1] as string;

    const form = new URLSearchParams();
    form.append('pass', movieOrEpisodeId);
    form.append('param', '');
    form.append('extra', '');
    form.append('e2', '');
    form.append('server', '0');

    const response = await this.fetcher.textPost(
      ctx,
      new URL(url.pathname.includes('episode') ? '/home/index/GetEInfoAjax' : '/home/index/GetMInfoAjax', url.origin),
      form.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': url.origin,
        },
      },
    );
    const jsonResponse = JSON.parse(response) as SoaperInfoResponsePartial;

    const m3u8Url = new URL(jsonResponse['val'], url.origin);

    return [
      {
        url: m3u8Url,
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          height: await guessHeightFromPlaylist(ctx, this.fetcher, m3u8Url, { headers: { Referer: url.href } }),
        },
      },
    ];
  };
}
