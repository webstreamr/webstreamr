import bytes from 'bytes';
import { ContentType, Stream } from 'stremio-addon-sdk';
import winston from 'winston';
import { logErrorAndReturnNiceString } from '../error';
import { ExtractorRegistry } from '../extractor';
import { Source } from '../source';
import { Context, Format, UrlResult } from '../types';
import { showErrors, showExternalUrls } from './config';
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

    let sourceErrorCount = 0;
    const urlResults: UrlResult[] = [];
    const sourcePromises = sources.map(async (source) => {
      if (!source.contentTypes.includes(type)) {
        return;
      }

      try {
        const sourceResults = await source.handle(ctx, type, id);

        const sourceUrlResults = await Promise.all(
          sourceResults.map(({ url, meta }) => this.extractorRegistry.handle(ctx, url, { ...meta, sourceLabel: source.label, sourceId: source.id })),
        );

        urlResults.push(...sourceUrlResults.flat());
      } catch (error) {
        sourceErrorCount++;

        if (showErrors(ctx.config)) {
          streams.push({
            name: envGetAppName(),
            title: [`🔗 ${source.label}`, logErrorAndReturnNiceString(ctx, this.logger, source.id, error)].join('\n'),
            externalUrl: source.baseUrl,
          });
        }
      }
    });
    await Promise.all(sourcePromises);

    urlResults.sort((a, b) => {
      if (a.error || b.error) {
        return a.isExternal ? -1 : 1;
      }

      if (a.isExternal || b.isExternal) {
        return a.isExternal ? 1 : -1;
      }

      const heightComparison = (b.meta?.height ?? 0) - (a.meta?.height ?? 0);
      if (heightComparison !== 0) {
        return heightComparison;
      }

      const bytesComparison = (b.meta?.bytes ?? 0) - (a.meta?.bytes ?? 0);
      if (bytesComparison !== 0) {
        return bytesComparison;
      }

      return a.label.localeCompare(b.label);
    });

    const errorCount = urlResults.reduce((count, urlResult) => urlResult.error ? count + 1 : count, sourceErrorCount);
    this.logger.info(`Got ${urlResults.length} url results, including ${errorCount} errors`, ctx);

    streams.push(
      ...urlResults.filter(urlResult => !urlResult.error || showErrors(ctx.config))
        .map(urlResult => ({
          ...this.buildUrl(urlResult),
          name: this.buildName(ctx, urlResult),
          title: this.buildTitle(ctx, urlResult),
          behaviorHints: {
            bingeGroup: `webstreamr-${urlResult.meta?.sourceId}-${urlResult.meta?.extractorId}-${urlResult.meta?.countryCodes?.join('_')}`,
            ...((urlResult.format !== Format.mp4 || urlResult.url.protocol !== 'https:') && { notWebReady: true }),
            ...(urlResult.requestHeaders !== undefined && {
              notWebReady: true,
              proxyHeaders: { request: urlResult.requestHeaders },
            }),
            ...(urlResult.meta?.bytes && { videoSize: urlResult.meta.bytes }),
          },
        })),
    );

    const ttl = sourceErrorCount === 0 ? this.determineTtl(urlResults) : undefined;

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

  private buildUrl(urlResult: UrlResult): { externalUrl: string } | { url: string } | { ytId: string } {
    /* istanbul ignore if */
    if (urlResult.ytId) {
      return { ytId: urlResult.ytId };
    }

    if (!urlResult.isExternal) {
      return { url: urlResult.url.href };
    }

    return { externalUrl: urlResult.url.href };
  };

  private buildName(ctx: Context, urlResult: UrlResult): string {
    let name = envGetAppName();

    urlResult.meta?.countryCodes?.forEach((countryCode) => {
      name += ` ${flagFromCountryCode(countryCode)}`;
    });

    if (urlResult.meta?.height) {
      name += ` ${urlResult.meta.height}p`;
    }

    if (urlResult.isExternal && showExternalUrls(ctx.config)) {
      name += ` ⚠️ external`;
    }

    return name;
  };

  private buildTitle(ctx: Context, urlResult: UrlResult): string {
    const titleLines = [];

    if (urlResult.meta?.title) {
      titleLines.push(urlResult.meta.title);
    }

    const titleDetailsLine = [];
    if (urlResult.meta?.bytes) {
      titleDetailsLine.push(`💾 ${bytes.format(urlResult.meta.bytes, { unitSeparator: ' ' })}`);
    }
    const sourceLabel = urlResult.meta?.sourceLabel;
    if (sourceLabel && sourceLabel !== urlResult.label) {
      titleDetailsLine.push(`🔗 ${urlResult.label} from ${urlResult.meta?.sourceLabel}`);
    } else {
      titleDetailsLine.push(`🔗 ${urlResult.label}`);
    }
    titleLines.push(titleDetailsLine.join(' '));

    if (urlResult.error) {
      titleLines.push(logErrorAndReturnNiceString(ctx, this.logger, urlResult.meta?.sourceId ?? '', urlResult.error));
    }

    return titleLines.join('\n');
  };
}
