import TTLCache from '@isaacs/ttlcache';
import winston from 'winston';
import { Extractor } from './types';
import { Context, Meta, UrlResult } from '../types';
import { Fetcher } from '../utils';
import { DoodStream } from './DoodStream';
import { Dropload } from './Dropload';
import { Fsst } from './Fsst';
import { SuperVideo } from './SuperVideo';
import { Soaper } from './Soaper';
import { ExternalUrl } from './ExternalUrl';
import { NotFoundError } from '../error';

export class ExtractorRegistry {
  private readonly logger: winston.Logger;
  private readonly extractors: Extractor[];
  private readonly urlResultCache: TTLCache<string, UrlResult[]>;

  constructor(logger: winston.Logger, fetcher: Fetcher) {
    this.logger = logger;
    this.extractors = [
      new DoodStream(fetcher),
      new Dropload(fetcher),
      new Fsst(fetcher),
      new SuperVideo(fetcher),
      new Soaper(fetcher),
      new ExternalUrl(fetcher), // fallback extractor which must come last
    ];
    this.urlResultCache = new TTLCache({ max: 1024 });
  }

  readonly handle = async (ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> => {
    const extractor = this.extractors.find(extractor => extractor.supports(ctx, url));
    if (!extractor) {
      return [];
    }

    const normalizedUrl = extractor.normalize(url);

    let urlResults = this.urlResultCache.get(normalizedUrl.href) ?? [];
    if (this.urlResultCache.has(normalizedUrl.href)) {
      return urlResults.map(urlResult => ({ ...urlResult, ttl: this.urlResultCache.getRemainingTTL(normalizedUrl.href) }));
    }

    this.logger.info(`Extract stream URL using ${extractor.id} extractor from ${url}`, ctx);

    try {
      urlResults = await extractor.extract(ctx, normalizedUrl, meta);
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.urlResultCache.set(normalizedUrl.href, urlResults, { ttl: extractor.ttl });

        return [];
      }

      return [
        {
          url,
          isExternal: true,
          error,
          label: url.host,
          sourceId: `${extractor.id}`,
          meta,
        },
      ];
    }

    this.urlResultCache.set(normalizedUrl.href, urlResults, { ttl: extractor.ttl });

    return urlResults;
  };
}
