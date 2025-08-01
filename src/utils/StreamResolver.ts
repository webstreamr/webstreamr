import bytes from 'bytes';
import { ContentType, Stream } from 'stremio-addon-sdk';
import winston from 'winston';
import { logErrorAndReturnNiceString, NotFoundError } from '../error';
import { ExtractorRegistry } from '../extractor';
import { Source } from '../source';
import { Context, Format, UrlResult } from '../types';
import { showExternalUrls } from './config';
import { envGetAppName } from './env';
import { Id } from './id';
import { flagFromCountryCode } from './language';

interface ResolveResponse {
  streams: Stream[];
  ttl?: number;
}

export class StreamResolver {
  private readonly logger: winston.Logger;
  private readonly extractorRegistry: ExtractorRegistry;

  public constructor(logger: winston.Logger, extractorRegistry: ExtractorRegistry) {
    this.logger = logger;
    this.extractorRegistry = extractorRegistry;
  }

  public async resolve(ctx: Context, sources: Source[], type: ContentType, id: Id): Promise<ResolveResponse> {
    if (sources.length === 0) {
      return {
        streams: [
          {
            name: 'WebStreamr',
            title: '⚠️ No sources found. Please re-configure the plugin.',
            externalUrl: ctx.hostUrl.href,
          },
        ],
      };
    }

    const streams: Stream[] = [];

    let handlerErrorOccurred = false;
    const urlResults: UrlResult[] = [];
    const handlerPromises = sources.map(async (handler) => {
      if (!handler.contentTypes.includes(type)) {
        return;
      }

      try {
        const handleResults = await handler.handle(ctx, type, id);
        this.logger.info(`${handler.id} returned ${handleResults.length} urls`, ctx);

        const handlerUrlResults = await Promise.all(
          handleResults.map(({ countryCode, title, url }) => this.extractorRegistry.handle(ctx, url, countryCode, title)),
        );

        urlResults.push(...handlerUrlResults.flat());
      } catch (error) {
        if (error instanceof NotFoundError) {
          return;
        }

        handlerErrorOccurred = true;

        streams.push({
          name: envGetAppName(),
          title: [`🔗 ${handler.label}`, logErrorAndReturnNiceString(ctx, this.logger, handler.id, error)].join('\n'),
          externalUrl: ctx.hostUrl.href,
        });
      }
    });
    await Promise.all(handlerPromises);

    urlResults.sort((a, b) => {
      const heightComparison = (b.meta.height ?? 0) - (a.meta.height ?? 0);
      if (heightComparison !== 0) {
        return heightComparison;
      }

      const bytesComparison = (b.meta.bytes ?? 0) - (a.meta.bytes ?? 0);
      if (bytesComparison !== 0) {
        return bytesComparison;
      }

      if (a.error || b.error) {
        return a.error ? 1 : -1;
      }

      if (a.isExternal || b.isExternal) {
        return a.isExternal ? 1 : -1;
      }

      return a.label.localeCompare(b.label);
    });

    this.logger.info(`Return ${urlResults.length} streams`, ctx);

    streams.push(
      ...urlResults.filter(urlResult => !urlResult.isExternal || showExternalUrls(ctx.config) || urlResult.error)
        .map(urlResult => ({
          ...this.buildUrl(ctx, urlResult),
          name: this.buildName(ctx, urlResult),
          title: this.buildTitle(ctx, urlResult),
          behaviorHints: {
            ...(urlResult.sourceId && { bingeGroup: `webstreamr-${urlResult.sourceId}` }),
            ...((urlResult.format !== Format.mp4 || urlResult.url.protocol !== 'https:') && { notWebReady: true }),
            ...(urlResult.requestHeaders !== undefined && {
              notWebReady: true,
              proxyHeaders: { request: urlResult.requestHeaders },
            }),
            ...(urlResult.meta.bytes && { videoSize: urlResult.meta.bytes }),
          },
        })),
    );

    const ttl = !handlerErrorOccurred ? this.determineTtl(urlResults) : undefined;

    return {
      streams,
      ...(ttl && { ttl }),
    };
  };

  private determineTtl(urlResults: UrlResult[]): number | undefined {
    if (!urlResults.length) {
      return 900000; // 15m
    }

    if (urlResults.some(urlResult => urlResult.ttl === undefined)) {
      return undefined;
    }

    return Math.min(...urlResults.map(urlResult => urlResult.ttl as number));
  };

  private buildUrl(ctx: Context, urlResult: UrlResult): { externalUrl: string } | { url: string } {
    if (!urlResult.isExternal) {
      return { url: urlResult.url.href };
    }

    if (showExternalUrls(ctx.config)) {
      return { externalUrl: urlResult.url.href };
    }

    return { externalUrl: ctx.hostUrl.href };
  };

  private buildName(ctx: Context, urlResult: UrlResult): string {
    let name = envGetAppName();

    urlResult.meta.countryCodes.forEach((countryCode) => {
      name += ` ${flagFromCountryCode(countryCode)}`;
    });

    if (urlResult.meta.height) {
      name += ` ${urlResult.meta.height}p`;
    }

    if (urlResult.isExternal && showExternalUrls(ctx.config)) {
      name += ` ⚠️ external`;
    }

    return name;
  };

  private buildTitle(ctx: Context, urlResult: UrlResult): string {
    const titleLines = [];

    if (urlResult.meta.title) {
      titleLines.push(urlResult.meta.title);
    }

    const titleDetailsLine = [];
    if (urlResult.meta.bytes) {
      titleDetailsLine.push(`💾 ${bytes.format(urlResult.meta.bytes, { unitSeparator: ' ' })}`);
    }
    titleDetailsLine.push(`🔗 ${urlResult.label}`);
    titleLines.push(titleDetailsLine.join(' '));

    if (urlResult.error) {
      titleLines.push(logErrorAndReturnNiceString(ctx, this.logger, urlResult.sourceId, urlResult.error));
    }

    return titleLines.join('\n');
  };
}
