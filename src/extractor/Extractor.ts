import { Context, CountryCode, Format, UrlResult } from '../types';
import { NotFoundError } from '../error';

export abstract class Extractor {
  public abstract readonly id: string;

  public abstract readonly label: string;

  public readonly ttl: number = 900000; // 15m

  public abstract supports(ctx: Context, url: URL): boolean;

  public normalize(url: URL): URL {
    return url;
  };

  protected abstract extractInternal(ctx: Context, url: URL, countryCode: CountryCode, title?: string | undefined): Promise<UrlResult[]>;

  public async extract(ctx: Context, url: URL, countryCode: CountryCode, title?: string | undefined): Promise<UrlResult[]> {
    try {
      return await this.extractInternal(ctx, url, countryCode, title);
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
          label: this.label,
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
