import type { AccountId, Address, AssetId, Int64String, PublicKey } from './primitive.types';

export interface Authority {
  weight_threshold: number; // Authority weight threshold
  account_auths: [AccountId, number][]; // Account authorizations
  key_auths: [PublicKey, number][]; // Key authorizations
  address_auths?: [Address, number][]; // Address authorizations (found in genesis)
}

export interface AccountOptions {
  memo_key: PublicKey;
  voting_account: AccountId; // GRAPHENE_PROXY_TO_SELF_ACCOUNT = "1.2.5" in mainnet
  num_witness: number;
  num_committee: number;
  votes: string[]; // vote_id_type, e.g. "1:5", "0:12"
  extensions?: unknown[];
}

export interface AssetAmount {
  amount: Int64String; // in minimal parts (without considering precision)
  asset_id: AssetId;
}
