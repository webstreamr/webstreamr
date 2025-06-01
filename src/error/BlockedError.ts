import { BlockedReason } from '../types';

export class BlockedError extends Error {
  public readonly reason: BlockedReason;

  constructor(reason: BlockedReason) {
    super();

    this.reason = reason;
  }
}
