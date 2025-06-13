export class TmdbId {
  public readonly id: number;
  public readonly season: number | undefined;
  public readonly episode: number | undefined;

  public constructor(id: number, season: number | undefined, episode: number | undefined) {
    this.id = id;
    this.season = season;
    this.episode = episode;
  }

  public static fromString(id: string): TmdbId {
    const idParts = id.split(':');

    if (!idParts[0] || !/^\d+$/.test(idParts[0])) {
      throw new Error(`TMDB ID "${id}" is invalid`);
    }

    return new TmdbId(
      parseInt(idParts[0]),
      idParts[1] ? parseInt(idParts[1]) : undefined,
      idParts[2] ? parseInt(idParts[2]) : undefined,
    );
  }
}
