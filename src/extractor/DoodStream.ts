import randomstring from 'randomstring';
import { Extractor } from './types';
import { Fetcher } from '../utils';
import { Context } from '../types';

export class DoodStream implements Extractor {
  readonly id = 'doodstream';

  readonly label = 'DoodStream';

  readonly ttl = 900000; // 15m

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly supports = (url: URL): boolean => null !== url.host.match(/dood/);

  readonly extract = async (ctx: Context, url: URL, countryCode: string) => {
    const videoId = url.pathname.split('/').slice(-1)[0] as string;
    const normalizedUrl = new URL(`http://dood.to/e/${videoId}`);

    const html = await this.fetcher.text(ctx, new URL(normalizedUrl));

    const passMd5Match = html.match(/\/pass_md5\/[\w-]+\/([\w-]+)/);
    if (!passMd5Match) {
      // This will happen if either DoodStream does not like our IP or the video is not existing
      return undefined;
    }

    const token = passMd5Match[1] as string;

    const baseUrl = await this.fetcher.text(ctx, new URL(`http://dood.to${passMd5Match[0]}`));

    return {
      url: new URL(`${baseUrl + randomstring.generate(10)}?token=${token}&expiry=${Date.now()}`),
      label: this.label,
      sourceId: `${this.id}_${countryCode.toLowerCase()}`,
      height: 0,
      bytes: 0,
      countryCode,
      requestHeaders: {
        Referer: 'http://dood.to/',
      },
    };
  };
}
