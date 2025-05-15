import express, { NextFunction, Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry';
import { setupCache } from 'axios-cache-interceptor';
import winston from 'winston';
import {
  CineHDPlus,
  Eurostreaming,
  FrenchCloud,
  Handler,
  KinoKiste,
  MeineCloud,
  MostraGuarda,
  VerHdLink,
} from './handler';
import { EmbedExtractorRegistry } from './embed-extractor';
import { ConfigureController, ManifestController, StreamController } from './controller';
import { Fetcher, StreamResolver } from './utils';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`),
      ),
    }),
  ],
});

setupCache(axios);
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error: AxiosError) => isNetworkOrIdempotentRequestError(error) || (error.response?.status ?? 0) > 400,
});

const fetcher = new Fetcher(axios, logger);

const embedExtractors = new EmbedExtractorRegistry(logger, fetcher);

const handlers: Handler[] = [
  // ES / MX
  new CineHDPlus(fetcher, embedExtractors),
  new VerHdLink(fetcher, embedExtractors),
  // DE
  new KinoKiste(fetcher, embedExtractors),
  new MeineCloud(fetcher, embedExtractors),
  // FR
  new FrenchCloud(fetcher, embedExtractors),
  // IT
  new Eurostreaming(fetcher, embedExtractors),
  new MostraGuarda(fetcher, embedExtractors),
];

const addon = express();
addon.set('trust proxy', true);

addon.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (process.env['NODE_ENV'] === 'production') {
    res.setHeader('Cache-Control', 'max-age=10, public');
  }

  next();
});

addon.use('/', (new ConfigureController(handlers)).router);
addon.use('/', (new ManifestController(handlers)).router);
addon.use('/', (new StreamController(logger, handlers, new StreamResolver(logger))).router);

addon.get('/', (_req: Request, res: Response) => {
  res.redirect('/configure');
});

const port = parseInt(process.env['PORT'] || '51546');
addon.listen(port, () => {
  logger.info(`Add-on Repository URL: http://127.0.0.1:${port}/manifest.json`);
});
