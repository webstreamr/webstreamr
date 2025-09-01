import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { Context, CountryCode, Format, UrlResult } from '../types';
import {
  buildMediaFlowProxyExtractorStreamUrl,
  Fetcher, guessHeightFromPlaylist,
  supportsMediaFlowProxy,
} from '../utils';
import { Extractor } from './Extractor';

/** @see https://github.com/Gujal00/ResolveURL/commits/master/script.module.resolveurl/lib/resolveurl/plugins/filelions.py */
export class FileLions extends Extractor {
  public readonly id = 'filelions';

  public readonly label = 'FileLions (via MediaFlow Proxy)';

  public override readonly ttl = 0;

  public override viaMediaFlowProxy = true;

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public supports(ctx: Context, url: URL): boolean {
    const supportedDomain = null !== url.host.match(/.*lions?/)
      || [
        '6sfkrspw4u.sbs',
        'ajmidyadfihayh.sbs',
        'alhayabambi.sbs',
        'anime7u.com',
        'azipcdn.com',
        'coolciima.online',
        'dhtpre.com',
        'e4xb5c2xnz.sbs',
        'egsyxutd.sbs',
        'fdewsdc.sbs',
        'gsfomqu.sbs',
        'javplaya.com',
        'katomen.online',
        'kinoger.be',
        'lumiawatch.top',
        'mivalyo.com',
        'moflix-stream.click',
        'motvy55.store',
        'movearnpre.com',
        'peytonepre.com',
        'ryderjet.com',
        'smoothpre.com',
        'techradar.ink',
        'videoland.sbs',
        'vidhide.com',
        'vidhide.fun',
        'vidhidehub.com',
        'vidhideplus.com',
        'vidhidepre.com',
        'vidhidepro.com',
        'vidhidevip.com',
      ].includes(url.host);

    return supportedDomain && supportsMediaFlowProxy(ctx);
  }

  public override normalize(url: URL): URL {
    return new URL(url.href.replace('/f/', '/v/').replace('/download/', '/v/').replace('/file/', '/v/'));
  }

  protected async extractInternal(ctx: Context, url: URL, countryCode: CountryCode, _title: string | undefined, referer: string | undefined): Promise<UrlResult[]> {
    const headers = { ...(referer && { Referer: referer }) };

    const playlistUrl = await buildMediaFlowProxyExtractorStreamUrl(ctx, this.fetcher, 'FileLions', url, headers);

    const fileUrl = new URL(url.href.replace('/v/', '/f/'));
    const html = await this.fetcher.text(ctx, fileUrl, { headers });

    const sizeMatch = html.match(/([\d.]+ ?[GM]B)/);

    const $ = cheerio.load(html);
    const title = $('title').text().trim().replace(/^Watch /, '').trim();

    return [
      {
        url: playlistUrl,
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${countryCode}`,
        ttl: this.ttl,
        meta: {
          countryCodes: [countryCode],
          height: await guessHeightFromPlaylist(ctx, this.fetcher, playlistUrl),
          ...(sizeMatch && {
            bytes: bytes.parse(sizeMatch[1] as string) as number,
          }),
          ...(title && { title }),
        },
      },
    ];
  };
}
