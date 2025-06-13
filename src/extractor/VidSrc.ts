import * as cheerio from 'cheerio';
import slugify from 'slugify';
import { Extractor } from './types';
import { Fetcher, guessFromPlaylist } from '../utils';
import { Context, CountryCode, UrlResult } from '../types';
import { NotFoundError } from '../error';

export class VidSrc implements Extractor {
  public readonly id = 'vidsrc';

  public readonly label = 'VidSrc';

  public readonly ttl = 900000; // 15m

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  public readonly supports = (_ctx: Context, url: URL): boolean => null !== url.host.match(/vidsrc/);

  public readonly normalize = (url: URL): URL => url;

  public readonly extract = async (ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> => {
    const html = await this.fetcher.text(ctx, url);

    const $ = cheerio.load(html);

    const iframeUrl = new URL(($('#player_iframe').attr('src') as string).replace(/^\/\//, 'https://'));
    const title = $('title').text().trim();

    return Promise.all(
      $('.server')
        .map((_i, el) => ({ serverName: $(el).text(), dataHash: $(el).data('hash') }))
        .toArray()
        .filter(({ serverName }) => serverName === 'CloudStream Pro')
        .map(async ({ serverName, dataHash }) => {
          const iframeHtml = await this.fetcher.text(ctx, new URL(`/rcp/${dataHash}`, iframeUrl.origin));
          const srcMatch = iframeHtml.match(`src:\\s?'(.*)'`) as string[];

          const playerHtml = await this.fetcher.text(ctx, new URL(srcMatch[1] as string, iframeUrl.origin));
          const fileMatch = playerHtml.match(`file:\\s?'(.*)'`);
          if (!fileMatch) {
            throw new NotFoundError();
          }

          const m3u8Url = new URL(fileMatch[1] as string);
          const height = await guessFromPlaylist(ctx, this.fetcher, m3u8Url, { noReferer: true });

          return {
            url: m3u8Url,
            label: `${this.label} (${serverName})`,
            sourceId: `${this.id}_${slugify(serverName)}_${countryCode}`,
            ttl: this.ttl,
            meta: {
              countryCode,
              title,
              ...(height && { height }),
            },
          };
        }),
    );
  };
}
