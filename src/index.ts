import express, { NextFunction, Request, Response } from 'express';
import { socksDispatcher } from 'fetch-socks';
import { ProxyAgent, setGlobalDispatcher } from 'undici';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';
import { ConfigureController, ManifestController, StreamController } from './controller';
import { createExtractors, ExtractorRegistry } from './extractor';
import { CineHDPlus, Cuevana, Eurostreaming, Frembed, FrenchCloud, KinoGer, MegaKino, MeineCloud, MostraGuarda, Movix, Soaper, Source, StreamKiste, VerHdLink, VidSrc, VixSrc } from './source';
import { envGet, envIsProd, Fetcher, StreamResolver } from './utils';

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

const sources: Source[] = [
  // multi
  new VixSrc(fetcher),
  // EN
  new Soaper(fetcher),
  new VidSrc(fetcher),
  // ES / MX
  new CineHDPlus(fetcher),
  new Cuevana(fetcher),
  new VerHdLink(fetcher),
  // DE
  new KinoGer(fetcher),
  new MegaKino(fetcher),
  new MeineCloud(fetcher),
  new StreamKiste(fetcher),
  // FR
  new Frembed(fetcher),
  new FrenchCloud(fetcher),
  new Movix(fetcher),
  // IT
  new Eurostreaming(fetcher),
  new MostraGuarda(fetcher),
];

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

addon.use('/', (new ConfigureController(sources)).router);
addon.use('/', (new ManifestController(sources)).router);

const extractorRegistry = new ExtractorRegistry(logger, createExtractors(fetcher));
const streamResolver = new StreamResolver(logger, extractorRegistry);
addon.use('/', (new StreamController(logger, sources, streamResolver)).router);

addon.get('/', (_req: Request, res: Response) => {
  res.redirect('/configure');
});

const port = parseInt(envGet('PORT') || '51546');
addon.listen(port, () => {
  logger.info(`Add-on Repository URL: http://127.0.0.1:${port}/manifest.json`);
});
