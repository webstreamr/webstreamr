export class ImdbId {
  public readonly id: string;
  public readonly series: number | undefined;
  public readonly episode: number | undefined;

  constructor(id: string, series: number | undefined, episode: number | undefined) {
    this.id = id;
    this.series = series;
    this.episode = episode;
  }

  public static fromString(id: string): ImdbId {
    const idParts = id.split(':');

    if (!idParts[0] || !/^tt\d+$/.test(idParts[0])) {
      throw new Error(`IMDb ID "${id}" is invalid`);
    }

    return new ImdbId(
      idParts[0],
      idParts[1] ? parseInt(idParts[1]) : undefined,
      idParts[2] ? parseInt(idParts[2]) : undefined,
    );
  }
}
