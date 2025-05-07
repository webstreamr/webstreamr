export interface ImdbId { id: string; series: number | undefined; episode: number | undefined }

export const parseImdbId = (id: string): ImdbId => {
  const idParts = id.split(':');

  if (!idParts[0] || !idParts[0].startsWith('tt')) {
    throw new Error(`IMDb ID "${id}" is invalid`);
  }

  return {
    id: idParts[0],
    series: idParts[1] ? parseInt(idParts[1]) : undefined,
    episode: idParts[2] ? parseInt(idParts[2]) : undefined,
  };
};
