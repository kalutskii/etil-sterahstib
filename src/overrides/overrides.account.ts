import type { BitsharesRPC } from '@/connection/connection.rpc';
import { DatabaseAPI } from '@/database/database.api';
import type { FullAccount } from '@/database/database.schemas';

async function getAccount(rpc: BitsharesRPC, address: string): Promise<FullAccount | null> {
  // Gets on-chain bitshares account, returns null if not found,
  // raises error if more than one account found because it's ambiguous.

  const databaseAPI = new DatabaseAPI(rpc);
  const fullAccounts = await databaseAPI.getFullAccounts([address]);

  if (fullAccounts.length > 1) {
    throw new Error('More than one account found, please specify the correct account name');
  }

  const [_, fullAccount] = fullAccounts.findLast(([name, account]) => account.account.name === name) || [];

  return fullAccount || null;
}

async function accountExists(rpc: BitsharesRPC, address: string): Promise<boolean> {
  // Checks if bitshares account exists on the blockchain,
  // returns true if account exists, false otherwise.

  const databaseAPI = new DatabaseAPI(rpc);
  const account = await databaseAPI.getAccountByName(address);

  return !!account;
}

async function getAccountBalance(rpc: BitsharesRPC, address: string): Promise<number> {
  // Gets BTS account balance, returns balance amount in BTS
  // Throws error if account not found, balance is zero, or precision is invalid.

  const BTS_ASSET_ID = '1.3.0';
  const BTS_ASSET_PRECISION = 5;

  const databaseAPI = new DatabaseAPI(rpc);

  try {
    const accountBalances = await databaseAPI.getAccountBalances(address);
    const rawBalance = accountBalances.find((balance) => balance.asset_id === BTS_ASSET_ID)?.amount || 0;
    const balance = Number(rawBalance) / Math.pow(10, BTS_ASSET_PRECISION);

    return balance;
  } catch (error) {
    throw new Error('Failed to retrieve account balance, most likely due to account not existing');
  }
}

export { getAccount, accountExists, getAccountBalance };
