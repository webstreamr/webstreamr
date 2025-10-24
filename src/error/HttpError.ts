export class HttpError extends Error {
  public readonly url: URL;
  public readonly status: number;
  public readonly statusText: string;
  public readonly headers: Record<string, string[] | string | undefined>;

  public constructor(url: URL, status: number, statusText: string, headers: Record<string, string[] | string | undefined>) {
    super();

    this.url = url;
    this.status = status;
    this.statusText = statusText;
    this.headers = headers;
  }
}
