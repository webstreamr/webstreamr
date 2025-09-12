import { BlockedReason } from '../types';

export class BlockedError extends Error {
  public readonly url: URL;
  public readonly reason: BlockedReason;
  public readonly headers: Record<string, string[] | string | undefined>;

  public constructor(url: URL, reason: BlockedReason, headers: Record<string, string[] | string | undefined>) {
    super();

    this.url = url;
    this.reason = reason;
    this.headers = headers;
  }
}
