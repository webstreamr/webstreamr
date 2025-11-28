import { AxiosResponse } from 'axios';
import { BlockedReason } from '../types';

export class BlockedError extends Error {
  public readonly url: URL;
  public readonly reason: BlockedReason;
  public readonly headers: AxiosResponse['headers'];

  public constructor(url: URL, reason: BlockedReason, headers: AxiosResponse['headers']) {
    super();

    this.url = url;
    this.reason = reason;
    this.headers = headers;
  }
}
