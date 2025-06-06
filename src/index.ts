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
import { envGet, envIsProd, Fetcher, getImdbIdFromTmdbId, StreamResolver, tmdbFetch } from './utils';

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

  interface MovieResponsePartial { results: { id: number }[] }
  const movies = [
    ...(await tmdbFetch(ctx, fetcher, '/movie/now_playing') as MovieResponsePartial)['results'],
    ...(await tmdbFetch(ctx, fetcher, '/movie/popular') as MovieResponsePartial)['results'],
    ...(await tmdbFetch(ctx, fetcher, '/movie/top_rated') as MovieResponsePartial)['results'],
    ...(await tmdbFetch(ctx, fetcher, '/trending/movie/day') as MovieResponsePartial)['results'],
  ];

  const movieIds: number[] = [];
  movies.forEach((movie) => {
    if (!movieIds.includes(movie.id)) {
      movieIds.push(movie.id);
    }
  });

  for (const id of movieIds) {
    const imdbId = await getImdbIdFromTmdbId(ctx, fetcher, { id, series: undefined, episode: undefined });
    await streamResolver.resolve(ctx, handlers, 'movie', imdbId.id);
  }

  logger.info(`warmed up cache with ${movieIds.length} movies`, ctx);
  setTimeout(cacheWarmup, 3600000); // 1 hour
};
setTimeout(cacheWarmup, 10000);
