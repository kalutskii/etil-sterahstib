import type { BitsharesRPC } from '@/connection/connection.rpc';
import type * as Primitives from '@/types/primitive.types';

import type { OperationHistoryObject } from './history.schemas';

class HistoryAPI {
  constructor(private readonly rpc: BitsharesRPC) {}

  // get_account_history_operations
  // Fetches historical operations of a specific type (e.g., transfers only, type=0) for a given account.
  async getAccountHistoryOperations(
    accountNameOrId: string | Primitives.AccountId,
    operationType: number,
    start: Primitives.OperationHistoryId = '1.11.0',
    stop: Primitives.OperationHistoryId = '1.11.0',
    limit: number = 100
  ): Promise<OperationHistoryObject[]> {
    return this.rpc.call<OperationHistoryObject[]>('history', 'get_account_history_operations', [
      accountNameOrId,
      operationType,
      start,
      stop,
      limit,
    ]);
  }

  // get_relative_account_history
  async getRelativeAccountHistory(
    accountNameOrId: string | Primitives.AccountId,
    stop: number = 0,
    limit: number = 100,
    start: number = 0
  ): Promise<OperationHistoryObject[]> {
    return this.rpc.call<OperationHistoryObject[]>('history', 'get_relative_account_history', [accountNameOrId, stop, limit, start]);
  }
}

export { HistoryAPI };
