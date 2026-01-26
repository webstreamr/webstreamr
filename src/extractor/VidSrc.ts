import * as cheerio from 'cheerio';
import { BlockedError, TooManyRequestsError } from '../error';
import { Context, Format, InternalUrlResult, Meta, NonEmptyArray } from '../types';
import { Fetcher, guessHeightFromPlaylist } from '../utils';
import { Extractor } from './Extractor';

export class VidSrc extends Extractor {
  public readonly id = 'vidsrc';

  public readonly label = 'VidSrc';

  public override readonly ttl: number = 10800000; // 3h

  private readonly domains: NonEmptyArray<string>;

  public constructor(fetcher: Fetcher, domains: NonEmptyArray<string>) {
    super(fetcher);

    this.domains = domains;
  }

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/vidsrc|vsrc/);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<InternalUrlResult[]> {
    // While this is a crappy thing to do, they seem to be blocking overly strict IMO
    const randomIp = `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    const newCtx = { ...ctx, ip: randomIp };

    return this.extractUsingRandomDomain(newCtx, url, meta, [...this.domains]);
  };

  private async extractUsingRandomDomain(ctx: Context, url: URL, meta: Meta, domains: string[]): Promise<InternalUrlResult[]> {
    const domainIndex = Math.floor(Math.random() * domains.length);
    const [domain] = domains.splice(domainIndex, 1) as [string];

    const newUrl = new URL(url);
    newUrl.hostname = domain;

    let html: string;
    try {
      html = await this.fetcher.text(ctx, newUrl, { queueLimit: 1 });
    } catch (error) {
      /* istanbul ignore next */
      if (domains.length && (error instanceof TooManyRequestsError || error instanceof BlockedError)) {
        return this.extractUsingRandomDomain(ctx, url, meta, domains);
      }

      /* istanbul ignore next */
      throw error;
    }

    const $ = cheerio.load(html.replace('<!--', '').replace('-->', '')); // server HTML is commented-out

    const iframeUrl = new URL(($('#player_iframe').attr('src') as string).replace(/^\/\//, 'https://'));
    const title = $('title').text().trim();

    return Promise.all(
      $('.server')
        .map((_i, el) => ({ serverName: $(el).text(), dataHash: $(el).data('hash') }))
        .toArray()
        .filter(({ serverName }) => serverName === 'CloudStream Pro')
        .map(async ({ serverName, dataHash }) => {
          const rcpUrl = new URL(`/rcp/${dataHash}`, iframeUrl.origin);
          const iframeHtml = await this.fetcher.text(ctx, rcpUrl, { headers: { Referer: newUrl.origin } });
          const srcMatch = iframeHtml.match(`src:\\s?'(.*)'`) as string[];

          const playerHtml = await this.fetcher.text(ctx, new URL(srcMatch[1] as string, iframeUrl.origin), { headers: { Referer: rcpUrl.href } });
          const fileMatch = playerHtml.match(`(https:\\/\\/.*?{v\\d}.*?) or`) as string[];
          const m3u8Url = new URL((fileMatch[1] as string).replace(/{v\d}/, iframeUrl.host));

          return {
            url: m3u8Url,
            format: Format.hls,
            label: serverName,
            meta: {
              ...meta,
              height: await guessHeightFromPlaylist(ctx, this.fetcher, m3u8Url, { headers: { Referer: iframeUrl.href } }),
              title,
            },
          };
        }),
    );
  }
}
