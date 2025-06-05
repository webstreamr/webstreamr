export class HttpError extends Error {
  public readonly status: number;
  public readonly headers: Record<string, string[] | string | undefined>;

  constructor(status: number, headers: Record<string, string[] | string | undefined>) {
    super();

    this.status = status;
    this.headers = headers;
  }
}
