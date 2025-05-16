import { Extractor } from './types';
import { extractUrlFromPacked, Fetcher } from '../utils';
import { Context } from '../types';
import bytes from 'bytes';

export class Mixdrop implements Extractor {
  readonly id = 'mixdrop';

  readonly label = 'Mixdrop';

  readonly ttl = 900000; // 15m

  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  readonly supports = (url: URL): boolean => null !== url.host.match(/mixdrop/);

  readonly extract = async (ctx: Context, url: URL, countryCode: string) => {
    const normalizedFullUrl = url.href.replace('/e/', '/f/');
    const fullHtml = await this.fetcher.text(ctx, new URL(normalizedFullUrl));

    const sizeMatch = fullHtml.match(/([\d.]+ ?[GM]B)/) as string[];

    const normalizedEmbedUrl = url.href.replace('/f/', '/e/');
    const embedHtml = await this.fetcher.text(ctx, new URL(normalizedEmbedUrl));

    return {
      url: extractUrlFromPacked(embedHtml, [/MDCore.wurl="(.*?)"/]),
      label: this.label,
      sourceId: `${this.id}_${countryCode.toLowerCase()}`,
      height: 0,
      bytes: bytes.parse(sizeMatch[1] as string) as number,
      countryCode,
      requestHeaders: {
        'Referer': url.origin,
        'User-Agent': this.fetcher.getUserAgentForIp(ctx.ip),
      },
    };
  };
}
