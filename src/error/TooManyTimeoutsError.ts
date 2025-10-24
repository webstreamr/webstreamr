export class TooManyTimeoutsError extends Error {
  public readonly url: URL;

  public constructor(url: URL) {
    super();

    this.url = url;
  }
}
