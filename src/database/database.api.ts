import type { BitsharesRPC } from '@/connection/connection.rpc';
import type { AccountId, AssetId, ObjectId, PublicKey } from '@/types/primitive.types';
import type { AssetAmount } from '@/types/structures.types';

import type { AccountObject, AnyKnownObject, DynamicGlobalPropertyObject, FullAccount } from './database.schemas';

class DatabaseAPI {
  constructor(private readonly rpc: BitsharesRPC) {}

  // get_objects
  async getObjects(ids: ObjectId[], subscribe?: boolean | null): Promise<(AnyKnownObject | null)[]> {
    // method: 'get_objects' on 'database'
    return this.rpc.call<(AnyKnownObject | null)[]>('database', 'get_objects', subscribe === undefined ? [ids] : [ids, subscribe]);
  }

  // get_dynamic_global_properties
  async getDynamicGlobalProperties(): Promise<DynamicGlobalPropertyObject> {
    return this.rpc.call<DynamicGlobalPropertyObject>('database', 'get_dynamic_global_properties', []);
  }

  // get_chain_id
  async getChainId(): Promise<string> {
    return this.rpc.call<string>('database', 'get_chain_id', []);
  }

  // get_key_references
  async getKeyReferences(keys: PublicKey[]): Promise<AccountId[][]> {
    return this.rpc.call<AccountId[][]>('database', 'get_key_references', [keys]);
  }

  // get_account_by_name
  async getAccountByName(name: string): Promise<AccountObject | null> {
    const res = await this.rpc.call<AccountObject | null>('database', 'get_account_by_name', [name]);
    return res ?? null;
  }

  // get_accounts (batch by id)
  async getAccounts(accountIds: AccountId[]): Promise<(AccountObject | null)[]> {
    return this.rpc.call<(AccountObject | null)[]>('database', 'get_accounts', [accountIds]);
  }

  // get_full_accounts
  async getFullAccounts(namesOrIds: string[], subscribe?: boolean | null): Promise<Array<[string, FullAccount]>> {
    return this.rpc.call<Array<[string, FullAccount]>>(
      'database',
      'get_full_accounts',
      subscribe === undefined ? [namesOrIds] : [namesOrIds, subscribe]
    );
  }

  // get_account_balances (by name or id)
  async getAccountBalances(accountNameOrId: string | AccountId, assets: AssetId[] = []): Promise<AssetAmount[]> {
    return this.rpc.call<AssetAmount[]>('database', 'get_account_balances', [accountNameOrId, assets]);
  }

  // get_named_account_balances (same as get_account_balances but by name)
  async getNamedAccountBalances(accountName: string, assets: AssetId[] = []): Promise<AssetAmount[]> {
    return this.rpc.call<AssetAmount[]>('database', 'get_named_account_balances', [accountName, assets]);
  }

  // get_required_fees - returns a list of fees for each operation
  // In practice, it always returns a "asset" (amount + asset_id) or an array of such for nested ops.
  // Typed as AssetAmount | unknown[] for compatibility with all op variants.
  async getRequiredFees(
    ops: unknown[], // serialized operations (as in wallet/cli)
    feeAssetSymbolOrId: string
  ): Promise<(AssetAmount | unknown)[]> {
    return this.rpc.call<(AssetAmount | unknown)[]>('database', 'get_required_fees', [ops, feeAssetSymbolOrId]);
  }
}

export { DatabaseAPI };
