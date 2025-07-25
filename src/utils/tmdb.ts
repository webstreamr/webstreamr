import { NotFoundError } from '../error';
import { Context } from '../types';
import { envGet } from './env';
import { CustomRequestInit, Fetcher } from './Fetcher';
import { ImdbId, TmdbId } from './id';

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

const tmdbFetch = async (ctx: Context, fetcher: Fetcher, path: string, searchParams?: Record<string, string | undefined>): Promise<unknown> => {
  const config: CustomRequestInit = {
    headers: {
      'Authorization': 'Bearer ' + envGet('TMDB_ACCESS_TOKEN'),
      'Content-Type': 'application/json',
    },
    queueLimit: 50,
  };

  const url = new URL(`https://api.themoviedb.org/3${path}`);

  Object.entries(searchParams ?? {}).forEach(([name, value]) => {
    if (value) {
      url.searchParams.set(name, value);
    }
  });

  return JSON.parse(await fetcher.text(ctx, url, config));
};

const imdbTmdbMap = new Map<string, number>();
export const getTmdbIdFromImdbId = async (ctx: Context, fetcher: Fetcher, imdbId: ImdbId): Promise<TmdbId> => {
  if (imdbTmdbMap.has(imdbId.id)) {
    return new TmdbId(imdbTmdbMap.get(imdbId.id) as number, imdbId.season, imdbId.episode);
  }

  const response = await tmdbFetch(ctx, fetcher, `/find/${imdbId.id}?external_source=imdb_id`) as FindResponsePartial;

  const id = (imdbId.season ? response.tv_results[0] : response.movie_results[0])?.id;

  if (!id) {
    throw new NotFoundError(`Could not get TMDB ID of IMDb ID "${imdbId.id}"`);
  }

  imdbTmdbMap.set(imdbId.id, id);
  return new TmdbId(id, imdbId.season, imdbId.episode);
};

const tmdbImdbMap = new Map<number, string>();
export const getImdbIdFromTmdbId = async (ctx: Context, fetcher: Fetcher, tmdbId: TmdbId): Promise<ImdbId> => {
  if (tmdbImdbMap.has(tmdbId.id)) {
    return new ImdbId(tmdbImdbMap.get(tmdbId.id) as string, tmdbId.season, tmdbId.episode);
  }

  const type = tmdbId.season ? 'tv' : 'movie';

  const response = await tmdbFetch(ctx, fetcher, `/${type}/${tmdbId.id}/external_ids`) as ExternalIdsResponsePartial;

  tmdbImdbMap.set(tmdbId.id, response.imdb_id);
  return new ImdbId(response.imdb_id, tmdbId.season, tmdbId.episode);
};

const getTmdbMovieDetails = async (ctx: Context, fetcher: Fetcher, tmdbId: TmdbId, language?: string): Promise<MovieDetailsResponsePartial> => {
  return await tmdbFetch(ctx, fetcher, `/movie/${tmdbId.id}`, { language }) as MovieDetailsResponsePartial;
};

const getTmdbTvDetails = async (ctx: Context, fetcher: Fetcher, tmdbId: TmdbId, language?: string): Promise<TvDetailsResponsePartial> => {
  return await tmdbFetch(ctx, fetcher, `/tv/${tmdbId.id}`, { language }) as TvDetailsResponsePartial;
};

export const getTmdbNameAndYear = async (ctx: Context, fetcher: Fetcher, tmdbId: TmdbId, language?: string): Promise<[string, number]> => {
  if (tmdbId.season) {
    const tmdbDetails = await getTmdbTvDetails(ctx, fetcher, tmdbId, language);

    return [tmdbDetails.name, (new Date(tmdbDetails.first_air_date)).getFullYear()];
  }

  const tmdbDetails = await getTmdbMovieDetails(ctx, fetcher, tmdbId, language);

  return [tmdbDetails.title, (new Date(tmdbDetails.release_date)).getFullYear()];
};
