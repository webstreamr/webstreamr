import { ImdbId } from './imdb';
import { Context } from '../types';
import { Fetcher } from './Fetcher';

export interface TmdbId { id: number; series: number | undefined; episode: number | undefined }

export const getTmdbIdFromImdbId = async (ctx: Context, fetcher: Fetcher, imdbId: ImdbId): Promise<TmdbId> => {
  const url = new URL(`https://api.themoviedb.org/3/find/${imdbId.id}?external_source=imdb_id`);
  const config = { 'headers': { Authorization: 'Bearer ' + process.env['TMDB_ACCESS_TOKEN'] }, 'Content-Type': 'application/json' };
  const response = JSON.parse(await fetcher.text(ctx, url, config));

  const id = (imdbId.series ? response.tv_results[0] : response.movie_results[0])?.id;

  if (!id) {
    throw new Error(`Could not get TMDB ID of IMDb ID "${imdbId.id}"`);
  }

  return { id, series: imdbId.series, episode: imdbId.episode };
};
