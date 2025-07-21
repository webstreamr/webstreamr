import express, { NextFunction, Request, Response } from 'express';
import { socksDispatcher } from 'fetch-socks';
import { ProxyAgent, setGlobalDispatcher } from 'undici';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';
import { ConfigureController, ManifestController, StreamController } from './controller';
import { BlockedError } from './error';
import { createExtractors, ExtractorRegistry } from './extractor';
import { createSources } from './source';
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

addon.get('/health', async (req: Request, res: Response) => {
  const ctx = contextFromRequestAndResponse(req, res);

  const urls = [
    new URL('https://www3.homecine.to'),
    new URL('https://soaper.live'),
    new URL('https://supervideo.cc'),
  ];

  let blockedCount = 0;
  let errorCount = 0;

  for (const url of urls) {
    try {
      await fetcher.head(ctx, url, { noCache: true });
    } catch (error) {
      if (error instanceof BlockedError) {
        blockedCount++;
      } else {
        logger.error(`health check error: ${JSON.stringify(error)}`, ctx);
        errorCount++;
      }
    }
  }

  if (blockedCount > 0) {
    res.status(503).json({ status: 'blocked' });
  } else if (errorCount === urls.length) {
    res.status(503).json({ status: 'error' });
  } else {
    res.json({ status: 'ok' });
  }
});

const port = parseInt(envGet('PORT') || '51546');
addon.listen(port, () => {
  logger.info(`Add-on Repository URL: http://127.0.0.1:${port}/manifest.json`);
});
