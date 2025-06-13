export class HttpError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly headers: Record<string, string[] | string | undefined>;

  public constructor(status: number, statusText: string, headers: Record<string, string[] | string | undefined>) {
    super();

    this.status = status;
    this.statusText = statusText;
    this.headers = headers;
  }
}
