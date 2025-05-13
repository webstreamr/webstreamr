import TTLCache from '@isaacs/ttlcache';
import winston from 'winston';
import { EmbedExtractor } from './types';
import { Context, UrlResult } from '../types';
import { Fetcher } from '../utils';
import { Dropload } from './Dropload';
import { SuperVideo } from './SuperVideo';

export class EmbedExtractorRegistry {
  private readonly logger: winston.Logger;
  private readonly embedExtractors: EmbedExtractor[];
  private readonly urlResultCache: TTLCache<string, UrlResult>;

  constructor(logger: winston.Logger, fetcher: Fetcher) {
    this.logger = logger;
    this.embedExtractors = [
      new Dropload(fetcher),
      new SuperVideo(fetcher),
    ];
    this.urlResultCache = new TTLCache({ max: 1024 });
  }

  readonly handle = async (ctx: Context, url: URL, countryCode: string): Promise<UrlResult | undefined> => {
    let urlResult = this.urlResultCache.get(url.href);
    if (urlResult) {
      return urlResult;
    }

    const embedExtractor = this.embedExtractors.find(embedExtractor => embedExtractor.supports(url));
    if (undefined === embedExtractor) {
      return undefined;
    }

    this.logger.info(`Extract stream URL using ${embedExtractor.id} extractor from ${url}`);

    urlResult = await embedExtractor.extract(ctx, url, countryCode);
    this.urlResultCache.set(url.href, urlResult, { ttl: embedExtractor.ttl });

    return urlResult;
  };
}
