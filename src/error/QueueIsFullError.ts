export class QueueIsFullError extends Error {
  public readonly url: URL;

  public constructor(url: URL) {
    super();

    this.url = url;
  }
}
