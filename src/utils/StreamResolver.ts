import { Stream } from 'stremio-addon-sdk';
import { flag } from 'country-emoji';
import winston from 'winston';
import bytes from 'bytes';
import { Context, UrlResult } from '../types';
import { Handler } from '../handler';
import { NotFoundError } from '../error';

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
      } catch (err) {
        if (err instanceof NotFoundError) {
          return;
        }

        streams.push({
          name: 'WebStreamr',
          title: `❌ Error with handler "${handler.id}". Please create an issue if this persists. Request-id: ${ctx.id}`,
          ytId: 'E4WlUXrJgy4',
        });

        this.logger.error(`${handler.id} error: ${err}`, ctx);
      }
    });
    await Promise.all(handlerPromises);

    urlResults.sort((a, b) => {
      const heightComparison = b.height - a.height;
      if (heightComparison !== 0) {
        return heightComparison;
      }

      const bytesComparison = b.bytes - a.bytes;
      if (bytesComparison !== 0) {
        return bytesComparison;
      }

      return a.label.localeCompare(b.label);
    });

    this.logger.info(`Return ${urlResults.length} streams`, ctx);

    streams.push(
      ...urlResults.map((urlResult) => {
        let name = 'WebStreamr';
        if (urlResult.height) {
          name += ` ${urlResult.height}p`;
        }
        if (urlResult.isExternal) {
          name += ` external`;
        }

        let title = urlResult.label;
        if (urlResult.bytes) {
          title += ` | 💾 ${bytes.format(urlResult.bytes, { unitSeparator: ' ' })}`;
        }
        if (urlResult.countryCode) {
          title += ` | ${flag(urlResult.countryCode)}`;
        }

        return {
          [urlResult.isExternal ? 'externalUrl' : 'url']: urlResult.url.href,
          name,
          title,
          behaviorHints: {
            bingeGroup: `webstreamr-${urlResult.sourceId}`,
            ...(urlResult.requestHeaders !== undefined && {
              notWebReady: true,
              proxyHeaders: { request: urlResult.requestHeaders },
            }),
            ...(urlResult.bytes && { videoSize: urlResult.bytes }),
          },
        };
      }),
    );

    return streams;
  };
}
