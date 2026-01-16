import * as cheerio from 'cheerio';
import { Context, Meta, UrlResult } from '../types';
import { Fetcher } from '../utils';
import { Extractor } from './Extractor';
import { HubCloud } from './HubCloud';

export class HubDrive extends Extractor {
  public readonly id = 'hubdrive';

  public readonly label = 'HubDrive';

  public override readonly ttl: number = 518400000; // 6d

  private readonly hubCloud: HubCloud;

  public constructor(fetcher: Fetcher, hubCloud: HubCloud) {
    super(fetcher);

    this.hubCloud = hubCloud;
  }

  public supports(_ctx: Context, url: URL): boolean {
    return null !== url.host.match(/hubdrive/);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const html = await this.fetcher.text(ctx, url, { headers });
    const $ = cheerio.load(html);

    const hubCloudUrl = new URL($('a:contains("HubCloud")').attr('href') as string);

    return this.hubCloud.extract(ctx, hubCloudUrl, meta);
  };
}
