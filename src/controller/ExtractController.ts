import { Mutex } from 'async-mutex';
import { Request, Response, Router } from 'express';
import winston from 'winston';
import { ExtractorRegistry } from '../extractor';
import { contextFromRequestAndResponse, Fetcher } from '../utils';

export class ExtractController {
  public readonly router: Router;

  private readonly logger: winston.Logger;
  private readonly extractorRegistry: ExtractorRegistry;

  private readonly locks = new Map<string, Mutex>();

  public constructor(logger: winston.Logger, _fetcher: Fetcher, extractorRegistry: ExtractorRegistry) {
    this.router = Router();

    this.logger = logger;
    this.extractorRegistry = extractorRegistry;

    this.router.get('/extract', this.extract.bind(this));
  }

  private async extract(req: Request, res: Response) {
    if (req.method !== 'GET') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const ctx = contextFromRequestAndResponse(req, res);

    const index = parseInt(req.query['index'] as string);
    const url = new URL(req.query['url'] as string);

    this.logger.info(`Lazy extract index ${index} of URL ${url} for ip ${ctx.ip}`, ctx);

    let mutex = this.locks.get(url.href);
    if (!mutex) {
      mutex = new Mutex();
      this.locks.set(url.href, mutex);
    }

    await mutex.runExclusive(async () => {
      const urlResults = await this.extractorRegistry.handle(ctx, url);

      res.redirect(urlResults[index]?.url.href as string);
    });

    if (!mutex.isLocked()) {
      this.locks.delete(url.href);
    }
  };
}
