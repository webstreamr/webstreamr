import express, { NextFunction, Request, Response } from 'express';
import makeFetchHappen from 'make-fetch-happen';
import { flag } from 'country-emoji';
import winston from 'winston';
import { landingTemplate } from './landingTemplate';
import { FrenchCloud, Handler, KinoKiste, MeineCloud, MostraGuarda, VerHdLink } from './handler';
import { Dropload, EmbedExtractors, SuperVideo } from './embed-extractor';
import { buildManifest, Fetcher } from './utils';
import { Config, UrlResult } from './types';
import fs from 'node:fs';
import * as os from 'node:os';
import bytes from 'bytes';

const addon = express();
addon.set('trust proxy', true);

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

addon.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (process.env['NODE_ENV'] === 'production') {
    res.setHeader('Cache-Control', 'max-age=3600, public');
  }

  next();
});

addon.get('/', (_req: Request, res: Response) => {
  res.redirect('/configure');
});

addon.get('/configure', (_req: Request, res: Response) => {
  const manifest = buildManifest(handlers, {});

  res.setHeader('content-type', 'text/html');
  res.send(landingTemplate(manifest));
});

addon.get('/:config/configure', (req: Request, res: Response) => {
  const config: Config = JSON.parse(req.params['config'] || '{}');

  const manifest = buildManifest(handlers, config);

  res.setHeader('content-type', 'text/html');
  res.send(landingTemplate(manifest));
});

addon.get('/manifest.json', (_req: Request, res: Response) => {
  const manifest = buildManifest(handlers, {});

  res.setHeader('Content-Type', 'application/json');
  res.send(manifest);
});

addon.get('/:config/manifest.json', (req: Request, res: Response) => {
  const config: Config = JSON.parse(req.params['config'] || '{}');

  const manifest = buildManifest(handlers, config);

  res.setHeader('Content-Type', 'application/json');
  res.send(manifest);
});

addon.get('/:config/stream/:type/:id.json', async function (req: Request, res: Response) {
  const config: Config = JSON.parse(req.params['config'] || '{}');
  const type: string = req.params['type'] || '';
  const id: string = req.params['id'] || '';

  logger.info(`Search stream for type "${type}" and id "${id}"`);

  res.setHeader('Content-Type', 'application/json');

  const selectedHandlers = handlers.filter(handler => handler.id in config);
  if (selectedHandlers.length === 0) {
    logger.info('No handlers configured, bail out');

    res.send(JSON.stringify({
      streams: [{
        name: 'WebStreamr',
        title: '⚠️ No handlers found. Please re-configure the plugin.',
        ytId: 'E4WlUXrJgy4',
      }],
    }));
    return;
  }

  const urlResults: UrlResult[] = [];
  const handlerPromises = selectedHandlers.map(async (handler) => {
    if (!handler.contentTypes.includes(type)) {
      return;
    }

    try {
      const handlerUrlResults = await handler.handle({ ip: req.ip as string }, id);
      logger.info(`${handler.id} returned ${handlerUrlResults.length} urls`);

      urlResults.push(...handlerUrlResults);
    } catch (err) {
      logger.error(`${handler.id} error: ` + err);
    }
  });
  await Promise.all(handlerPromises);

  urlResults.sort((a, b) => {
    const heightComparison = (b.height ?? 0) - (a.height ?? 0);
    if (heightComparison !== 0) {
      return heightComparison;
    }

    return (b.bytes ?? 0) - (a.bytes ?? 0);
  });

  logger.info(`Return ${urlResults.length} streams`);

  const streams = urlResults.map((urlResult) => {
    let name = 'WebStreamr';
    if (urlResult.height) {
      name += ` ${urlResult.height}p`;
    }

    let title = urlResult.label;
    if (urlResult.bytes) {
      title += ` | 💾 ${bytes.format(urlResult.bytes, { unitSeparator: ' ' })}`;
    }
    if (urlResult.countryCode) {
      title += ` | ${flag(urlResult.countryCode)}`;
    }

    return {
      url: urlResult.url.toString(),
      name,
      title,
      behaviourHints: {
        group: `webstreamr-${urlResult.sourceId}`,
      },
    };
  });

  res.send(JSON.stringify({ streams }));
});

const port = parseInt(process.env['PORT'] || '51546');
addon.listen(port, () => {
  logger.info(`Add-on Repository URL: http://127.0.0.1:${port}/manifest.json`);
});
