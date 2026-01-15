import { randomUUID } from 'node:crypto';
import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import axiosRetry from 'axios-retry';
import express, { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line import/no-named-as-default
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import { ConfigureController, ExtractController, ManifestController, StreamController } from './controller';
import { BlockedError, logErrorAndReturnNiceString } from './error';
import { createExtractors, ExtractorRegistry } from './extractor';
import { createSources, Source } from './source';
import { HomeCine } from './source/HomeCine';
import { MeineCloud } from './source/MeineCloud';
import { MostraGuarda } from './source/MostraGuarda';
import { contextFromRequestAndResponse, envGet, envIsProd, Fetcher, StreamResolver } from './utils';

if (envIsProd()) {
  console.log = console.warn = console.error = console.info = console.debug = () => { /* disable in favor of logger */ };
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, id }) => `${timestamp} ${level} ${id}: ${message}`)),
    }),
  ],
});

process.on('uncaughtException', (error: Error) => {
  logger.error(`Uncaught exception caught: ${error}, cause: ${error.cause}, stack: ${error.stack}`);
});

process.on('unhandledRejection', (error: Error) => {
  logger.error(`Unhandled rejection: ${error}, cause: ${error.cause}, stack: ${error.stack}`);
});

const cachedAxios = setupCache(axios);
axiosRetry(cachedAxios, { retries: 3, retryDelay: () => 333 });

const fetcher = new Fetcher(cachedAxios, logger);

const sources = createSources(fetcher);
const extractors = createExtractors(fetcher);

const addon = express();
addon.set('trust proxy', true);

if (envIsProd()) {
  addon.use(rateLimit({ windowMs: 60 * 1000, limit: 10 }));
}

addon.use((req: Request, res: Response, next: NextFunction) => {
  process.env['HOST'] = req.host;
  process.env['PROTOCOL'] = req.protocol;

  res.setHeader('X-Request-ID', randomUUID());

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (envIsProd()) {
    res.setHeader('Cache-Control', 'public, max-age=10, immutable');
  }

  next();
});

const extractorRegistry = new ExtractorRegistry(logger, extractors);

addon.use('/', (new ExtractController(logger, fetcher, extractorRegistry)).router);
addon.use('/', (new ConfigureController(sources, extractors)).router);
addon.use('/', (new ManifestController(sources, extractors)).router);

const streamResolver = new StreamResolver(logger, extractorRegistry);
addon.use('/', (new StreamController(logger, sources, streamResolver)).router);

addon.get('/', (_req: Request, res: Response) => {
  res.redirect('/configure');
});

addon.get('/startup', async (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

addon.get('/ready', async (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

let lastLiveProbeRequestsTimestamp = 0;
addon.get('/live', async (req: Request, res: Response) => {
  const ctx = contextFromRequestAndResponse(req, res);

  const sources: Source[] = [
    new HomeCine(fetcher),
    new MeineCloud(fetcher),
    new MostraGuarda(fetcher),
  ];
  const hrefs = [
    ...sources.map(source => source.baseUrl),
    'https://cloudnestra.com',
  ];

  const results = new Map<string, string>();

  let blockedCount = 0;
  let errorCount = 0;

  const fetchFactories = hrefs.map(href => async () => {
    const url = new URL(href);

    try {
      await fetcher.head(ctx, url);
      results.set(url.host, 'ok');
    } catch (error) {
      if (error instanceof BlockedError) {
        results.set(url.host, 'blocked');
        blockedCount++;
      } else {
        results.set(url.host, 'error');
        errorCount++;
      }

      logErrorAndReturnNiceString(ctx, logger, href, error);
    }
  });

  if (Date.now() - lastLiveProbeRequestsTimestamp > 60000 || 'force' in req.query) { // every minute
    await Promise.all(fetchFactories.map(fn => fn()));
    lastLiveProbeRequestsTimestamp = Date.now();
  }

  const details = Object.fromEntries(results);

  if (blockedCount > 0) {
    // TODO: fail health check and try to get a clean IP if infra is ready
    logger.warn('IP might be not clean and leading to blocking.', ctx);
    res.json({ status: 'ok', details });
  } else if (errorCount === sources.length) {
    res.status(503).json({ status: 'error', details });
  } else {
    res.json({ status: 'ok', ipStatus: 'ok', details });
  }
});

addon.get('/stats', async (_req: Request, res: Response) => {
  res.json({
    extractorRegistry: extractorRegistry.stats(),
    fetcher: fetcher.stats(),
    sources: Source.stats(),
  });
});

const port = parseInt(envGet('PORT') || '51546');
addon.listen(port, () => {
  logger.info(`Add-on Repository URL: http://127.0.0.1:${port}/manifest.json`);
});
