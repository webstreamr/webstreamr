import express, { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';
import {
  CineHDPlus,
  Frembed,
  FrenchCloud,
  Handler,
  StreamKiste,
  MeineCloud,
  MostraGuarda,
  Soaper,
  VerHdLink,
} from './handler';
import { ExtractorRegistry } from './extractor';
import { ConfigureController, ManifestController, StreamController } from './controller';
import { envGet, envIsProd, Fetcher, StreamResolver, tmdbFetch, TmdbId } from './utils';

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
  // EN
  new Soaper(fetcher, extractorRegistry),
  // ES / MX
  new CineHDPlus(fetcher, extractorRegistry),
  new VerHdLink(fetcher, extractorRegistry),
  // DE
  new StreamKiste(fetcher, extractorRegistry),
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

  if (envIsProd()) {
    res.setHeader('Cache-Control', 'max-age=10, public');
  }

  next();
});

addon.use('/', (new ConfigureController(handlers)).router);
addon.use('/', (new ManifestController(handlers)).router);

const streamResolver = new StreamResolver(logger);
addon.use('/', (new StreamController(logger, handlers, streamResolver)).router);

addon.get('/', (_req: Request, res: Response) => {
  res.redirect('/configure');
});

const port = parseInt(envGet('PORT') || '51546');
addon.listen(port, () => {
  logger.info(`Add-on Repository URL: http://127.0.0.1:${port}/manifest.json`);
});

const cacheWarmup = async () => {
  const ctx = { id: 'warmup', ip: '127.0.0.1', config: { de: 'on', en: 'on', es: 'on', fr: 'on', it: 'on', mx: 'on' } };
  logger.info(`starting cache warmup`, ctx);

  interface ResponsePartial { results: { id: number }[] }

  const movies = [
    ...(await tmdbFetch(ctx, fetcher, '/trending/movie/day') as ResponsePartial)['results'],
  ];
  const movieIds: number[] = [];
  movies.forEach((movie) => {
    if (!movieIds.includes(movie.id)) {
      movieIds.push(movie.id);
    }
  });
  for (const id of movieIds) {
    await streamResolver.resolve(ctx, handlers, 'movie', new TmdbId(id, undefined, undefined));
  }
  logger.info(`warmed up cache with ${movieIds.length} movies`, ctx);

  const tvShows = [
    ...(await tmdbFetch(ctx, fetcher, '/trending/tv/day') as ResponsePartial)['results'],
  ];
  const tvShowIds: number[] = [];
  tvShows.forEach((tvShow) => {
    if (!tvShowIds.includes(tvShow.id)) {
      tvShowIds.push(tvShow.id);
    }
  });
  for (const id of tvShowIds) {
    await streamResolver.resolve(ctx, handlers, 'series', new TmdbId(id, 1, 1));
  }
  logger.info(`warmed up cache with ${tvShowIds.length} tv shows`, ctx);

  setTimeout(cacheWarmup, 3600000); // 1 hour
};

if (envIsProd()) {
  setTimeout(cacheWarmup, 10000);
}
