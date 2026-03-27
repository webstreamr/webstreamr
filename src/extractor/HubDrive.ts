import * as cheerio from 'cheerio';
import { Context, InternalUrlResult, Meta } from '../types';
import { Fetcher } from '../utils';
import { Extractor } from './Extractor';
import { HubCloud } from './HubCloud';

export class HubDrive extends Extractor {
  public readonly id = 'hubdrive';

  public readonly label = 'HubDrive';

  public override readonly ttl: number = 43200000; // 12h

  public override readonly cacheVersion = 1;

  private readonly hubCloud: HubCloud;

  public constructor(fetcher: Fetcher, hubCloud: HubCloud) {
    super(fetcher);

    this.hubCloud = hubCloud;
  }

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/hubdrive/);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<InternalUrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const html = await this.fetcher.text(ctx, url, { headers });
    const $ = cheerio.load(html);

    const hubCloudUrl = $('a:contains("HubCloud")')
      .map((_i, el) => new URL($(el).attr('href') as string))
      .get(0);

    return hubCloudUrl ? this.hubCloud.extract(ctx, hubCloudUrl, meta) : [];
  };
}
