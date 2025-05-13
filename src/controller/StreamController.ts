import { Request, Response, Router } from 'express';
import { Handler } from '../handler';
import { Config, UrlResult } from '../types';
import bytes from 'bytes';
import { flag } from 'country-emoji';
import winston from 'winston';

export class StreamController {
  public readonly router: Router;

  private readonly logger: winston.Logger;
  private readonly handlers: Handler[];

  constructor(logger: winston.Logger, handlers: Handler[]) {
    this.router = Router();

    this.logger = logger;
    this.handlers = handlers;

    this.router.get('/:config/stream/:type/:id.json', this.getStream.bind(this));
  }

  private readonly getStream = async (req: Request, res: Response) => {
    const config: Config = JSON.parse(req.params['config'] || '{}');
    const type: string = req.params['type'] || '';
    const id: string = req.params['id'] || '';

    this.logger.info(`Search stream for type "${type}" and id "${id}"`);

    res.setHeader('Content-Type', 'application/json');

    const selectedHandlers = this.handlers.filter(handler => handler.id in config);
    if (selectedHandlers.length === 0) {
      this.logger.info('No handlers configured, bail out');

      res.send(JSON.stringify({
        streams: [{
          name: 'WebStreamr',
          title: '⚠️ No handlers found. Please re-configure the plugin.',
          ytId: 'E4WlUXrJgy4',
        }],
      }));
      return;
    }

    const urlResults: UrlResult[] = [];
    const handlerPromises = selectedHandlers.map(async (handler) => {
      if (!handler.contentTypes.includes(type)) {
        return;
      }

      try {
        const handlerUrlResults = await handler.handle({ ip: req.ip as string }, id);
        this.logger.info(`${handler.id} returned ${handlerUrlResults.length} urls`);

        urlResults.push(...handlerUrlResults);
      } catch (err) {
        this.logger.error(`${handler.id} error: ` + err);
      }
    });
    await Promise.all(handlerPromises);

    urlResults.sort((a, b) => {
      const heightComparison = (b.height ?? 0) - (a.height ?? 0);
      if (heightComparison !== 0) {
        return heightComparison;
      }

      return (b.bytes ?? 0) - (a.bytes ?? 0);
    });

    this.logger.info(`Return ${urlResults.length} streams`);

    const streams = urlResults.map((urlResult) => {
      let name = 'WebStreamr';
      if (urlResult.height) {
        name += ` ${urlResult.height}p`;
      }

      let title = urlResult.label;
      if (urlResult.bytes) {
        title += ` | 💾 ${bytes.format(urlResult.bytes, { unitSeparator: ' ' })}`;
      }
      if (urlResult.countryCode) {
        title += ` | ${flag(urlResult.countryCode)}`;
      }

      return {
        url: urlResult.url.toString(),
        name,
        title,
        behaviourHints: {
          group: `webstreamr-${urlResult.sourceId}`,
        },
      };
    });

    res.send(JSON.stringify({ streams }));
  };
}
