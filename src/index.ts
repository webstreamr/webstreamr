import express, { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';
import {
  CineHDPlus,
  Frembed,
  FrenchCloud,
  Handler,
  KinoKiste,
  MeineCloud,
  MostraGuarda,
  VerHdLink,
} from './handler';
import { ExtractorRegistry } from './extractor';
import { ConfigureController, ManifestController, StreamController } from './controller';
import { Fetcher, StreamResolver } from './utils';

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

const fetcher = new Fetcher(logger);

const extractorRegistry = new ExtractorRegistry(logger, fetcher);

const handlers: Handler[] = [
  // ES / MX
  new CineHDPlus(fetcher, extractorRegistry),
  new VerHdLink(fetcher, extractorRegistry),
  // DE
  new KinoKiste(fetcher, extractorRegistry),
  new MeineCloud(fetcher, extractorRegistry),
  // FR
  new Frembed(fetcher, extractorRegistry),
  new FrenchCloud(fetcher, extractorRegistry),
  // IT
  // new Eurostreaming(fetcher, extractorRegistry), // https://github.com/webstreamr/webstreamr/issues/83
  new MostraGuarda(fetcher, extractorRegistry),
];

const addon = express();
addon.set('trust proxy', true);

addon.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Request-ID', uuidv4());

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
