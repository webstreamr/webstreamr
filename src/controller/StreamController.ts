import { Mutex } from 'async-mutex';
import { Request, Response, Router } from 'express';
import { ContentType } from 'stremio-addon-sdk';
import winston from 'winston';
import { Source } from '../source';
import { contextFromRequestAndResponse, envIsProd, Id, ImdbId, StreamResolver, TmdbId } from '../utils';

const locks = new Map<string, Mutex>();

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

    this.router.get('/stream/:type/:id.json', this.getStream.bind(this));
    this.router.get('/:config/stream/:type/:id.json', this.getStream.bind(this));
  }

  private async getStream(req: Request, res: Response) {
    const type: ContentType = (req.params['type'] || '') as ContentType;
    const rawId: string = req.params['id'] || '';

    let id: Id;
    if (rawId.startsWith('tmdb:')) {
      id = TmdbId.fromString(rawId.replace('tmdb:', ''));
    } else if (rawId.startsWith('tt')) {
      id = ImdbId.fromString(rawId);
    } else {
      throw new Error(`Unsupported ID: ${rawId}`);
    }

    const ctx = contextFromRequestAndResponse(req, res);

    this.logger.info(`Search stream for type "${type}" and id "${rawId}" for ip ${ctx.ip}`, ctx);

    const sources = this.sources.filter(source => source.countryCodes.filter(countryCode => countryCode in ctx.config).length);

    let mutex = locks.get(rawId);
    if (!mutex) {
      mutex = new Mutex();
      locks.set(rawId, mutex);
    }

    await mutex.runExclusive(async () => {
      const { streams, ttl } = await this.streamResolver.resolve(ctx, sources, type, id);

      if (ttl && envIsProd()) {
        res.setHeader('Cache-Control', `max-age=${ttl / 1000}, public`);
      }

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ streams }));
    });

    if (!mutex.isLocked()) {
      locks.delete(rawId);
    }
  };
}
