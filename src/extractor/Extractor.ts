import { NotFoundError } from '../error';
import { Context, CountryCode, Format, UrlResult } from '../types';
import { guessHeightFromTitle } from '../utils';

export abstract class Extractor {
  public abstract readonly id: string;

  public abstract readonly label: string;

  public readonly ttl: number = 900000; // 15m

  public readonly viaMediaFlowProxy: boolean = false;

  public abstract supports(ctx: Context, url: URL): boolean;

  public normalize(url: URL): URL {
    return url;
  };

  protected abstract extractInternal(ctx: Context, url: URL, countryCode: CountryCode, title?: string | undefined): Promise<UrlResult[]>;

  public async extract(ctx: Context, url: URL, countryCode: CountryCode, title?: string | undefined): Promise<UrlResult[]> {
    try {
      const urlResults = await this.extractInternal(ctx, url, countryCode, title);

      return urlResults.map((urlResult) => {
        let height = urlResult.meta.height;

        if (!height && urlResult.meta.title) {
          height = guessHeightFromTitle(urlResult.meta.title);
        }

        return { ...urlResult, meta: { ...urlResult.meta, height } };
      });
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
            countryCodes: [countryCode],
            ...(title && { title }),
          },
        },
      ];
    }
  };
}
