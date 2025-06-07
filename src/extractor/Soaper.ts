import { Extractor } from './types';
import { Fetcher } from '../utils';
import { Context, Meta } from '../types';

export class Soaper implements Extractor {
  readonly id = 'soaper';

  readonly label = 'Soaper';

  readonly ttl = 900000; // 15m

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly supports = (_ctx: Context, url: URL): boolean => null !== url.host.match(/soaper/) && null !== url.pathname.match(/^\/(episode|movie)_/);

  readonly extract = async (ctx: Context, url: URL, meta: Meta) => {
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
        },
      },
    );
    const jsonResponse = JSON.parse(response);

    return {
      url: new URL(jsonResponse['val'], url.origin),
      label: this.label,
      sourceId: `${this.id}_${meta.countryCode.toLowerCase()}`,
      ttl: this.ttl,
      meta,
    };
  };
}
