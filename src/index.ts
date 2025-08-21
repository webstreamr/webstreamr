import express, { NextFunction, Request, Response } from 'express';
import { socksDispatcher } from 'fetch-socks';
import { Agent, Dispatcher, interceptors, ProxyAgent, setGlobalDispatcher } from 'undici';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';
import { ConfigureController, ManifestController, StreamController } from './controller';
import { BlockedError, logErrorAndReturnNiceString } from './error';
import { createExtractors, ExtractorRegistry } from './extractor';
import { createSources, Source } from './source';
import { HomeCine } from './source/HomeCine';
import { MeineCloud } from './source/MeineCloud';
import { MostraGuarda } from './source/MostraGuarda';
import { XPrime } from './source/XPrime';
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

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception caught:', error);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection: ', reason);
});

let dispatcher: Dispatcher;
if (process.env['ALL_PROXY']) {
  const proxyUrl = new URL(process.env['ALL_PROXY']);
  if (proxyUrl.protocol === 'socks5:') {
    dispatcher = socksDispatcher({ type: 5, host: proxyUrl.hostname, port: parseInt(proxyUrl.port) }, { allowH2: true });
  } else {
    dispatcher = new ProxyAgent({ uri: proxyUrl.href, allowH2: true });
  }
} else {
  dispatcher = new Agent({ allowH2: true });
}
dispatcher.compose(
  interceptors.dns(),
  interceptors.retry({ maxRetries: 3 }),
);
setGlobalDispatcher(dispatcher);

const fetcher = new Fetcher(logger);

const sources = createSources(fetcher);
const extractors = createExtractors(fetcher);

const addon = express();
addon.set('trust proxy', true);

addon.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Request-ID', uuidv4());

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (envIsProd()) {
    res.setHeader('Cache-Control', 'max-age=10, public');
  }

  next();
});

addon.use('/', (new ConfigureController(sources, extractors)).router);
addon.use('/', (new ManifestController(sources, extractors)).router);

const extractorRegistry = new ExtractorRegistry(logger, extractors);
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
    new XPrime(fetcher),
  ];

  let blockedCount = 0;
  let errorCount = 0;

  const fetchFactories = sources.map(source => async () => {
    const url = new URL(source.baseUrl);

    try {
      await fetcher.head(ctx, url, { noCache: true });
    } catch (error) {
      if (error instanceof BlockedError) {
        blockedCount++;
      } else {
        errorCount++;
      }

      logErrorAndReturnNiceString(ctx, logger, url.href, error);
    }
  });

  if (Date.now() - lastLiveProbeRequestsTimestamp > 60000) { // every minute
    await Promise.all(fetchFactories.map(fn => fn()));
    lastLiveProbeRequestsTimestamp = Date.now();
  }

  if (blockedCount > 0) {
    // TODO: fail health check and try to get a clean IP if infra is ready
    logger.warn('IP might be not clean and leading to blocking.', ctx);
  }

  if (errorCount === sources.length) {
    res.status(503).json({ status: 'error' });
  } else {
    res.json({ status: 'ok' });
  }
});

const port = parseInt(envGet('PORT') || '51546');
addon.listen(port, () => {
  logger.info(`Add-on Repository URL: http://127.0.0.1:${port}/manifest.json`);
});
