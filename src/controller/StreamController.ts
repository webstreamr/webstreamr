import { Request, Response, Router } from 'express';
import winston from 'winston';
import { Handler } from '../handler';
import { Config } from '../types';
import { StreamResolver } from '../utils';

export class StreamController {
  public readonly router: Router;

  private readonly logger: winston.Logger;
  private readonly handlers: Handler[];
  private readonly streamResolver: StreamResolver;

  constructor(logger: winston.Logger, handlers: Handler[], streams: StreamResolver) {
    this.router = Router();

    this.logger = logger;
    this.handlers = handlers;
    this.streamResolver = streams;

    this.router.get('/:config/stream/:type/:id.json', this.getStream.bind(this));
  }

  private readonly getStream = async (req: Request, res: Response) => {
    const config: Config = JSON.parse(req.params['config'] || '{}');
    const type: string = req.params['type'] || '';
    const id: string = req.params['id'] || '';

    this.logger.info(`Search stream for type "${type}" and id "${id}"`);

    const selectedHandlers = this.handlers.filter(handler => handler.id in config);

    const streams = await this.streamResolver.resolve({ ip: (req.ip as string) }, selectedHandlers, type, id);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ streams }));
  };
}
