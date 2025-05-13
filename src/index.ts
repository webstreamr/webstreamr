import express, { NextFunction, Request, Response } from 'express';
import makeFetchHappen from 'make-fetch-happen';
import winston from 'winston';
import { FrenchCloud, Handler, KinoKiste, MeineCloud, MostraGuarda, VerHdLink } from './handler';
import { Dropload, EmbedExtractors, SuperVideo } from './embed-extractor';
import { ConfigureController, ManifestController, StreamController } from './controller';
import { Fetcher } from './utils';
import fs from 'node:fs';
import * as os from 'node:os';

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

const fetcher = new Fetcher(
  makeFetchHappen.defaults({
    cachePath: `${fs.realpathSync(os.tmpdir())}/webstreamr`,
    maxSockets: 5,
  }),
  logger,
);

const embedExtractors = new EmbedExtractors([
  new Dropload(fetcher),
  new SuperVideo(fetcher),
]);

const handlers: Handler[] = [
  new FrenchCloud(fetcher, embedExtractors),
  new KinoKiste(fetcher, embedExtractors),
  new MeineCloud(fetcher, embedExtractors),
  new MostraGuarda(fetcher, embedExtractors),
  new VerHdLink(fetcher, embedExtractors),
];

const addon = express();
addon.set('trust proxy', true);

addon.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  next();
});

addon.use('/', (new ConfigureController(handlers)).router);
addon.use('/', (new ManifestController(handlers)).router);
addon.use('/', (new StreamController(logger, handlers)).router);

addon.get('/', (_req: Request, res: Response) => {
  res.redirect('/configure');
});

const port = parseInt(process.env['PORT'] || '51546');
addon.listen(port, () => {
  logger.info(`Add-on Repository URL: http://127.0.0.1:${port}/manifest.json`);
});
