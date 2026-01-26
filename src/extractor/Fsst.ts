import * as cheerio from 'cheerio';
import { Context, Format, InternalUrlResult, Meta } from '../types';
import { Extractor } from './Extractor';

export class Fsst extends Extractor {
  public readonly id = 'fsst';

  public readonly label = 'Fsst';

  public override readonly ttl: number = 10800000; // 3h

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/fsst/);
  };

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<InternalUrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const html = await this.fetcher.text(ctx, url, { headers, noProxyHeaders: true });

    const $ = cheerio.load(html);
    const title = $('title').text().trim();

    const filesMatch = html.match(/file:"(.*)"/) as string[];

    const lastFile = (filesMatch[1] as string).split(',').pop() as string;

    const heightAndUrlMatch = lastFile.match(/\[?([\d]*)p?]?(.*)/) as string[];
    const fileHref = heightAndUrlMatch[2] as string;

    return [{
      url: await this.fetcher.getFinalRedirectUrl(ctx, new URL(fileHref), { headers, noProxyHeaders: true }, 1),
      format: Format.mp4,
      meta: {
        ...meta,
        height: parseInt(heightAndUrlMatch[1] as string),
        title,
      },
    }];
  };
}
