import type { BitsharesRPC } from '@/connection/connection.rpc';
import { HistoryAPI } from '@/history/history.api';
import type { OperationHistoryObject } from '@/history/history.schemas';
import { accountExists } from '@/overrides/overrides.account';

async function getTransactionsHistory({
  rpc,
  address,
  limit = 100,
}: {
  rpc: BitsharesRPC;
  address: string;
  limit?: number;
}): Promise<OperationHistoryObject[]> {
  // Gets the transactions history for the provided address,
  // available only last 100 transactions because of the blockchain's history limit.

  const TRANSFER_OPERATION_ID = 0;
  const FIRST_OPERATION_ID = '1.11.0';
  const LAST_OPERATION_ID = '1.11.0';

  const historyAPI = new HistoryAPI(rpc);
  const passedAccountExists = await accountExists(rpc, address);

  if (!passedAccountExists) {
    throw new Error('Account does not exist, unable to fetch transactions');
  }

  const transactions = await historyAPI.getAccountHistoryOperations(
    address,
    TRANSFER_OPERATION_ID,
    FIRST_OPERATION_ID,
    LAST_OPERATION_ID,
    limit
  );

  return transactions || [];
}

export { getTransactionsHistory };
