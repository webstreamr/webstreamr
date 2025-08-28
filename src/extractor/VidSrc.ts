import * as cheerio from 'cheerio';
import slugify from 'slugify';
import { NotFoundError, TooManyRequestsError } from '../error';
import { Context, CountryCode, Format, NonEmptyArray, UrlResult } from '../types';
import { Fetcher, guessHeightFromPlaylist } from '../utils';
import { Extractor } from './Extractor';

export class VidSrc extends Extractor {
  public readonly id = 'vidsrc';

  public readonly label = 'VidSrc';

  private readonly tlds: NonEmptyArray<string>;

  public constructor(fetcher: Fetcher, tlds: NonEmptyArray<string>) {
    super(fetcher);

    this.tlds = tlds;
  }

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/vidsrc/);
  }

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> {
    return this.extractUsingRandomTld(ctx, url, countryCode, [...this.tlds]);
  };

  private async extractUsingRandomTld(ctx: Context, url: URL, countryCode: CountryCode, tlds: string[]): Promise<UrlResult[]> {
    const tldIndex = Math.floor(Math.random() * tlds.length);
    const [tld] = tlds.splice(tldIndex, 1) as [string];

    const newUrl = new URL(url);
    const hostnameParts = newUrl.hostname.split('.');
    hostnameParts[hostnameParts.length - 1] = tld;
    newUrl.hostname = hostnameParts.join('.');

    let html: string;
    try {
      html = await this.fetcher.text(ctx, newUrl);
    } catch (error) {
      if (error instanceof TooManyRequestsError && tlds.length) {
        return this.extractUsingRandomTld(ctx, url, countryCode, tlds);
      }

      throw error;
    }

    const $ = cheerio.load(html);

    const iframeUrl = new URL(($('#player_iframe').attr('src') as string).replace(/^\/\//, 'https://'));
    const title = $('title').text().trim();

    return Promise.all(
      $('.server')
        .map((_i, el) => ({ serverName: $(el).text(), dataHash: $(el).data('hash') }))
        .toArray()
        .filter(({ serverName }) => serverName === 'CloudStream Pro')
        .map(async ({ serverName, dataHash }) => {
          const iframeHtml = await this.fetcher.text(ctx, new URL(`/rcp/${dataHash}`, iframeUrl.origin), { headers: { Referer: iframeUrl.origin } });
          const srcMatch = iframeHtml.match(`src:\\s?'(.*)'`) as string[];

          const playerHtml = await this.fetcher.text(ctx, new URL(srcMatch[1] as string, iframeUrl.origin), { headers: { Referer: iframeUrl.origin } });
          const fileMatch = playerHtml.match(`file:\\s?'(.*)'`);
          if (!fileMatch) {
            throw new NotFoundError();
          }

          const m3u8Url = new URL(fileMatch[1] as string);

          return {
            url: m3u8Url,
            format: Format.hls,
            label: `${this.label} (${serverName})`,
            sourceId: `${this.id}_${slugify(serverName)}_${countryCode}`,
            ttl: this.ttl,
            meta: {
              countryCodes: [countryCode],
              height: await guessHeightFromPlaylist(ctx, this.fetcher, m3u8Url),
              title,
            },
          };
        }),
    );
  }
}
