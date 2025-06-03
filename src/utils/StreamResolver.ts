import { Stream } from 'stremio-addon-sdk';
import { flag } from 'country-emoji';
import winston from 'winston';
import bytes from 'bytes';
import { Context, UrlResult } from '../types';
import { Handler } from '../handler';
import { NotFoundError } from '../error';
import { languageFromCountryCode } from './languageFromCountryCode';

export class StreamResolver {
  private readonly logger: winston.Logger;

  constructor(logger: winston.Logger) {
    this.logger = logger;
  }

  readonly resolve = async (ctx: Context, handlers: Handler[], type: string, id: string): Promise<Stream[]> => {
    if (handlers.length === 0) {
      return [{
        name: 'WebStreamr',
        title: '⚠️ No handlers found. Please re-configure the plugin.',
        ytId: 'E4WlUXrJgy4',
      }];
    }

    const streams: Stream[] = [];

    const urlResults: UrlResult[] = [];
    const handlerPromises = handlers.map(async (handler) => {
      if (!handler.contentTypes.includes(type)) {
        return;
      }

      try {
        const handlerUrlResults = await handler.handle(ctx, type, id);
        this.logger.info(`${handler.id} returned ${handlerUrlResults.length} urls`, ctx);

        urlResults.push(...(handlerUrlResults.filter(handlerUrlResult => handlerUrlResult !== undefined)));
      } catch (error) {
        if (error instanceof NotFoundError) {
          return;
        }

        streams.push({
          name: 'WebStreamr',
          title: `❌ Error with handler "${handler.id}". Please create an issue if this persists. Request-id: ${ctx.id}`,
          ytId: 'E4WlUXrJgy4',
        });

        const cause = (error as Error & { cause?: unknown }).cause;

        this.logger.error(`${handler.id} error: ${error}, cause: ${cause}`, ctx);
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

      return a.label.localeCompare(b.label);
    });

    this.logger.info(`Return ${urlResults.length} streams`, ctx);

    streams.push(
      ...urlResults.map(urlResult => ({
        [urlResult.isExternal ? 'externalUrl' : 'url']: urlResult.url.href,
        name: this.buildName(urlResult),
        title: this.buildTitle(urlResult),
        behaviorHints: {
          ...(urlResult.sourceId && { bingeGroup: `webstreamr-${urlResult.sourceId}` }),
          ...(urlResult.requestHeaders !== undefined && {
            notWebReady: true,
            proxyHeaders: { request: urlResult.requestHeaders },
          }),
          ...(urlResult.meta.bytes && { videoSize: urlResult.meta.bytes }),
        },
      })),
    );

    return streams;
  };

  private readonly buildName = (urlResult: UrlResult): string => {
    let name = process.env['MANIFEST_NAME'] || 'WebStreamr';

    name += urlResult.meta.height ? ` ${urlResult.meta.height}P` : ' N/A';

    if (urlResult.isExternal) {
      name += ` ⚠️ external`;
    }

    return name;
  };

  private readonly buildTitle = (urlResult: UrlResult): string => {
    const titleLines = [];

    if (urlResult.meta.title) {
      titleLines.push(`📂 ${urlResult.meta.title}`);
    }

    if (urlResult.meta.bytes) {
      titleLines.push(`💾 ${bytes.format(urlResult.meta.bytes, { unitSeparator: ' ' })}`);
    }

    if (urlResult.meta.countryCode) {
      titleLines.push(`🌐 ${languageFromCountryCode(urlResult.meta.countryCode)} ${flag(urlResult.meta.countryCode)}`);
    }

    titleLines.push(`🔗 ${urlResult.label}`);

    if (urlResult.blocked) {
      titleLines.push('⚠️ Request was blocked.');
    }

    return titleLines.join('\n');
  };
}
