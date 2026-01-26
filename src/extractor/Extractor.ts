import { NotFoundError } from '../error';
import { Context, Format, InternalUrlResult, Meta, UrlResult } from '../types';
import { Fetcher } from '../utils';

export abstract class Extractor {
  public abstract readonly id: string;

  public abstract readonly label: string;

  public readonly ttl: number = 900000; // 15m

  public readonly viaMediaFlowProxy: boolean = false;

  protected readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  public abstract supports(ctx: Context, url: URL): boolean;

  public normalize(url: URL): URL {
    return url;
  };

  protected abstract extractInternal(ctx: Context, url: URL, meta: Meta): Promise<InternalUrlResult[]>;

  public async extract(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    try {
      return (await this.extractInternal(ctx, url, meta)).map(
        urlResult => ({
          ...urlResult,
          label: this.formatLabel(urlResult.label ?? this.label),
          ttl: this.ttl,

        }),
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        return [];
      }

      return [
        {
          url,
          format: Format.unknown,
          isExternal: true,
          error,
          label: this.formatLabel(this.label),
          ttl: 0,
          meta,
        },
      ];
    }
  };

  private formatLabel(label: string): string {
    return this.viaMediaFlowProxy ? `${label} (MFP)` : label;
  }
}
