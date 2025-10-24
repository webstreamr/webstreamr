export class TooManyRequestsError extends Error {
  public readonly url: URL;
  public readonly retryAfter: number;

  public constructor(url: URL, retryAfter: number) {
    super();

    this.url = url;
    this.retryAfter = retryAfter;
  }
}
