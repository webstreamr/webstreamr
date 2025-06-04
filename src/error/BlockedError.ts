import { BlockedReason } from '../types';

export class BlockedError extends Error {
  public readonly reason: BlockedReason;
  public readonly headers: Record<string, string[] | string | undefined>;

  constructor(reason: BlockedReason, headers: Record<string, string[] | string | undefined>) {
    super();

    this.reason = reason;
    this.headers = headers;
  }
}
