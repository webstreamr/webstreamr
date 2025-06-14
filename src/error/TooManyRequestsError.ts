export class TooManyRequestsError extends Error {
  public readonly retryAfter: number;

  public constructor(retryAfter: number) {
    super();

    this.retryAfter = retryAfter;
  }
}
