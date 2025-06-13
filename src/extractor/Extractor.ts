import { Context, CountryCode, UrlResult } from '../types';
import { NotFoundError } from '../error';

export abstract class Extractor {
  public abstract readonly id: string;

  public abstract readonly label: string;

  public readonly ttl: number = 900000; // 15m

  public abstract readonly supports: (ctx: Context, url: URL) => boolean;

  public readonly normalize = (url: URL): URL => url;

  protected abstract readonly extractInternal: (ctx: Context, url: URL, countryCode: CountryCode, title?: string | undefined) => Promise<UrlResult[]>;

  public readonly extract = async (ctx: Context, url: URL, countryCode: CountryCode, title?: string | undefined): Promise<UrlResult[]> => {
    try {
      return await this.extractInternal(ctx, url, countryCode, title);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return [];
      }

      return [
        {
          url,
          isExternal: true,
          error,
          label: url.host,
          sourceId: `${this.id}`,
          meta: {
            countryCode,
            ...(title && { title }),
          },
        },
      ];
    }
  };
}
