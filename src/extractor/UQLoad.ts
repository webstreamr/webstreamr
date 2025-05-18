import { Extractor } from './types';
import { Fetcher } from '../utils';
import { Context } from '../types';

export class UQLoad implements Extractor {
  readonly id = 'uqload';

  readonly label = 'UQLoad';

  readonly ttl = 900000; // 15m

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly supports = (url: URL): boolean => null !== url.host.match(/uqload/);

  readonly extract = async (ctx: Context, url: URL, countryCode: string) => {
    const html = await this.fetcher.text(ctx, url);

    const sourceMatch = html.match(/sources: ?\[["'](.*?)["']/) as string[];

    return {
      url: new URL(sourceMatch[1] as string),
      label: this.label,
      sourceId: `${this.id}_${countryCode.toLowerCase()}`,
      height: 0,
      bytes: 0,
      countryCode,
      requestHeaders: {
        Referer: `${url.protocol}//${url.host.split('.').slice().slice(-2).join('.')}`,
      },
    };
  };
}
