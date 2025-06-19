import express, { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';
import { CineHDPlus, Cuevana, Eurostreaming, Frembed, FrenchCloud, Source, KinoGer, MeineCloud, MostraGuarda, Soaper, StreamKiste, VerHdLink, VidSrc } from './source';
import { createExtractors, ExtractorRegistry } from './extractor';
import { ConfigureController, ManifestController, StreamController } from './controller';
import { envGet, envIsProd, Fetcher, StreamResolver, tmdbFetch, TmdbId } from './utils';
import { Context } from './types';

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

const sources: Source[] = [
  // EN
  new Soaper(fetcher),
  new VidSrc(fetcher),
  // ES / MX
  new CineHDPlus(fetcher),
  new Cuevana(fetcher),
  new VerHdLink(fetcher),
  // DE
  new KinoGer(fetcher),
  new MeineCloud(fetcher),
  new StreamKiste(fetcher),
  // FR
  new Frembed(fetcher),
  new FrenchCloud(fetcher),
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

const cacheWarmup = async () => {
  const ctx: Context = {
    hostUrl: new URL('http://localhost'),
    id: 'warmup',
    config: { de: 'on', en: 'on', es: 'on', fr: 'on', it: 'on', mx: 'on' },
  };
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
    await streamResolver.resolve(ctx, sources, 'movie', new TmdbId(id, undefined, undefined));
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
    await streamResolver.resolve(ctx, sources, 'series', new TmdbId(id, 1, 1));
  }
  logger.info(`warmed up cache with ${tvShowIds.length} tv shows`, ctx);

  setTimeout(cacheWarmup, 3600000); // 1 hour
};

if (envIsProd()) {
  setTimeout(cacheWarmup, 10000);
}
