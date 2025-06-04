import TTLCache from '@isaacs/ttlcache';
import winston from 'winston';
import { Extractor } from './types';
import { Context, Meta, UrlResult } from '../types';
import { Fetcher } from '../utils';
import { DoodStream } from './DoodStream';
import { Dropload } from './Dropload';
import { SuperVideo } from './SuperVideo';
import { ExternalUrl } from './ExternalUrl';
import { NotFoundError } from '../error';

export class ExtractorRegistry {
  private readonly logger: winston.Logger;
  private readonly extractors: Extractor[];
  private readonly urlResultCache: TTLCache<string, UrlResult | undefined>;

  constructor(logger: winston.Logger, fetcher: Fetcher) {
    this.logger = logger;
    this.extractors = [
      new DoodStream(fetcher),
      new Dropload(fetcher),
      new SuperVideo(fetcher),
      new ExternalUrl(fetcher), // fallback extractor which must come last
    ];
    this.urlResultCache = new TTLCache({ max: 1024 });
  }

  readonly handle = async (ctx: Context, url: URL, meta: Meta): Promise<UrlResult | undefined> => {
    let urlResult = this.urlResultCache.get(url.href);
    if (this.urlResultCache.has(url.href)) {
      return urlResult ? { ...urlResult, ttl: this.urlResultCache.getRemainingTTL(url.href) } : undefined;
    }

    const extractor = this.extractors.find(extractor => extractor.supports(ctx, url));
    if (!extractor) {
      return undefined;
    }

    this.logger.info(`Extract stream URL using ${extractor.id} extractor from ${url}`, ctx);

    try {
      urlResult = await extractor.extract(ctx, url, meta);
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.urlResultCache.set(url.href, urlResult, { ttl: extractor.ttl });

        return undefined;
      }

      return {
        url,
        isExternal: true,
        error,
        label: url.host,
        sourceId: `${extractor.id}`,
        ttl: extractor.ttl,
        meta,
      };
    }

    this.urlResultCache.set(url.href, urlResult, { ttl: extractor.ttl });

    return urlResult;
  };
}
