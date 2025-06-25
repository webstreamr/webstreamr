import { Request, Response, Router } from 'express';
import winston from 'winston';
import { Source } from '../source';
import { Config, Context, CountryCode } from '../types';
import { envIsProd, getDefaultConfig, ImdbId, StreamResolver } from '../utils';
import { ContentType } from 'stremio-addon-sdk';

export class StreamController {
  public readonly router: Router;

  private readonly logger: winston.Logger;
  private readonly sources: Source[];
  private readonly streamResolver: StreamResolver;

  public constructor(logger: winston.Logger, sources: Source[], streams: StreamResolver) {
    this.router = Router();

    this.logger = logger;
    this.sources = sources;
    this.streamResolver = streams;

    this.router.get('/:config/stream/:type/:id.json', this.getStream.bind(this));
  }

  private async getStream(req: Request, res: Response) {
    const config: Config = req.params['config'] ? JSON.parse(req.params['config']) : getDefaultConfig();
    const type: ContentType = (req.params['type'] || '') as ContentType;
    const id: string = req.params['id'] || '';

    const ctx: Context = {
      hostUrl: new URL(`${req.protocol}://${req.host}`),
      id: res.getHeader('X-Request-ID') as string,
      ...(req.ip && { ip: req.ip }),
      config,
    };

    this.logger.info(`Search stream for type "${type}" and id "${id}" for ip ${ctx.ip}`, ctx);

    const sources = this.sources.filter(handler => handler.countryCodes.filter(countryCode => countryCode in ctx.config || countryCode === CountryCode.multi).length);

    const { streams, ttl } = await this.streamResolver.resolve(ctx, sources, type, ImdbId.fromString(id));

    if (ttl && envIsProd()) {
      res.setHeader('Cache-Control', `max-age=${ttl / 1000}, public`);
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ streams }));
  };
}
