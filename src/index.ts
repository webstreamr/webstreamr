import express, { NextFunction, Request, Response } from 'express';
import { socksDispatcher } from 'fetch-socks';
import { ProxyAgent, setGlobalDispatcher } from 'undici';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';
import { ConfigureController, ManifestController, StreamController } from './controller';
import { BlockedError, logErrorAndReturnNiceString } from './error';
import { createExtractors, ExtractorRegistry } from './extractor';
import { createSources, Source } from './source';
import { HomeCine } from './source/HomeCine';
import { MeineCloud } from './source/MeineCloud';
import { Soaper } from './source/Soaper';
import { contextFromRequestAndResponse, envGet, envIsProd, Fetcher, StreamResolver } from './utils';

console.log = console.warn = console.error = console.info = console.debug = () => { /* disable in favor of logger */ };

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

if (process.env['ALL_PROXY']) {
  const proxyUrl = new URL(process.env['ALL_PROXY']);
  if (proxyUrl.protocol === 'socks5:') {
    setGlobalDispatcher(socksDispatcher({ type: 5, host: proxyUrl.hostname, port: parseInt(proxyUrl.port) }));
  } else {
    setGlobalDispatcher(new ProxyAgent({ uri: proxyUrl.href }));
  }
}
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

let lastHealthCheckRequestsTimestamp = 0;
addon.get('/health', async (req: Request, res: Response) => {
  const ctx = contextFromRequestAndResponse(req, res);

  const sources: Source[] = [
    new HomeCine(fetcher),
    new MeineCloud(fetcher),
    new Soaper(fetcher),
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

  if (Date.now() - lastHealthCheckRequestsTimestamp > 60000) { // every minute
    await Promise.all(fetchFactories.map(fn => fn()));
    lastHealthCheckRequestsTimestamp = Date.now();
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
