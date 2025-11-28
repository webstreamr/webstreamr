import { AxiosResponse } from 'axios';

export class HttpError extends Error {
  public readonly url: URL;
  public readonly status: number;
  public readonly statusText: string;
  public readonly headers: AxiosResponse['headers'];

  public constructor(url: URL, status: number, statusText: string, headers: AxiosResponse['headers']) {
    super();

    this.url = url;
    this.status = status;
    this.statusText = statusText;
    this.headers = headers;
  }
}
