import { Context } from '../../types';
import { Fetcher } from '../Fetcher';
import { getImdbIdFromTmdbId, getTmdbIdFromImdbId } from '../tmdb';
import { ImdbId } from './ImdbId';
import { TmdbId } from './TmdbId';

export * from './ImdbId';
export * from './TmdbId';

export type Id = ImdbId | TmdbId;

export const getImdbId = async (ctx: Context, fetcher: Fetcher, id: Id): Promise<ImdbId> => {
  if (id instanceof TmdbId) {
    return await getImdbIdFromTmdbId(ctx, fetcher, id);
  }

  return id;
};

export const getTmdbId = async (ctx: Context, fetcher: Fetcher, id: Id): Promise<TmdbId> => {
  if (id instanceof ImdbId) {
    return await getTmdbIdFromImdbId(ctx, fetcher, id);
  }

  return id;
};
