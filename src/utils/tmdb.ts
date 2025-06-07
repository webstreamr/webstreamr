import { ImdbId } from './imdb';
import { Context } from '../types';
import { Fetcher } from './Fetcher';
import { envGet } from './env';

export interface TmdbId { id: number; series: number | undefined; episode: number | undefined }

interface FindResponsePartial {
  movie_results: {
    id: number;
  }[];
  tv_results: {
    id: number;
  }[];
}

interface ExternalIdsResponsePartial {
  imdb_id: string;
}

interface MovieDetailsResponsePartial {
  release_date: string;
  title: string;
}

interface TvDetailsResponsePartial {
  first_air_date: string;
  name: string;
}

export const parseTmdbId = (id: string): TmdbId => {
  const idParts = id.split(':');

  if (!idParts[0] || !/^\d+$/.test(idParts[0])) {
    throw new Error(`TMDB ID "${id}" is invalid`);
  }

  return {
    id: parseInt(idParts[0]),
    series: idParts[1] ? parseInt(idParts[1]) : undefined,
    episode: idParts[2] ? parseInt(idParts[2]) : undefined,
  };
};

export const tmdbFetch = async (ctx: Context, fetcher: Fetcher, path: string): Promise<unknown> => {
  const config = { 'headers': { Authorization: 'Bearer ' + envGet('TMDB_ACCESS_TOKEN') }, 'Content-Type': 'application/json' };

  return JSON.parse(await fetcher.text(ctx, new URL(`https://api.themoviedb.org/3${path}`), config));
};

const imdbTmdbMap = new Map<string, number>();
export const getTmdbIdFromImdbId = async (ctx: Context, fetcher: Fetcher, imdbId: ImdbId): Promise<TmdbId> => {
  if (imdbTmdbMap.has(imdbId.id)) {
    return { id: imdbTmdbMap.get(imdbId.id) as number, series: imdbId.series, episode: imdbId.episode };
  }

  const response = await tmdbFetch(ctx, fetcher, `/find/${imdbId.id}?external_source=imdb_id`) as FindResponsePartial;

  const id = (imdbId.series ? response.tv_results[0] : response.movie_results[0])?.id;

  if (!id) {
    throw new Error(`Could not get TMDB ID of IMDb ID "${imdbId.id}"`);
  }

  imdbTmdbMap.set(imdbId.id, id);
  return { id, series: imdbId.series, episode: imdbId.episode };
};

const tmdbImdbMap = new Map<number, string>();
export const getImdbIdFromTmdbId = async (ctx: Context, fetcher: Fetcher, tmdbId: TmdbId): Promise<ImdbId> => {
  if (tmdbImdbMap.has(tmdbId.id)) {
    return { id: tmdbImdbMap.get(tmdbId.id) as string, series: tmdbId.series, episode: tmdbId.episode };
  }

  const type = tmdbId.series ? 'tv' : 'movie';

  const response = await tmdbFetch(ctx, fetcher, `/${type}/${tmdbId.id}/external_ids`) as ExternalIdsResponsePartial;

  tmdbImdbMap.set(tmdbId.id, response.imdb_id);
  return { id: response.imdb_id, series: tmdbId.series, episode: tmdbId.episode };
};

export const getTmdbMovieDetails = async (ctx: Context, fetcher: Fetcher, tmdbId: TmdbId): Promise<MovieDetailsResponsePartial> => {
  return await tmdbFetch(ctx, fetcher, `/movie/${tmdbId.id}`) as MovieDetailsResponsePartial;
};

export const getTmdbTvDetails = async (ctx: Context, fetcher: Fetcher, tmdbId: TmdbId): Promise<TvDetailsResponsePartial> => {
  return await tmdbFetch(ctx, fetcher, `/tv/${tmdbId.id}`) as TvDetailsResponsePartial;
};
