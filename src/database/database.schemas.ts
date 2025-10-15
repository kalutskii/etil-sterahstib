import type * as Primitives from '@/types/primitive.types';
import type { AccountOptions, AssetAmount, Authority } from '@/types/structures.types';

// account_object (1.2.x)
export interface AccountObject {
  id: Primitives.AccountId;
  membership_expiration_date: Primitives.TimePointSec;
  registrar: Primitives.AccountId;
  referrer: Primitives.AccountId;
  lifetime_referrer: Primitives.AccountId;

  network_fee_percentage: number;
  lifetime_referrer_fee_percentage: number;
  referrer_rewards_percentage: number;

  name: string;

  owner: Authority;
  active: Authority;
  options: AccountOptions;

  statistics: Primitives.AccountStatisticsId;

  whitelisting_accounts: Primitives.AccountId[]; // Flat_set
  whitelisted_accounts: Primitives.AccountId[]; // Flat_set (GUI helper)
  blacklisted_accounts: Primitives.AccountId[]; // Flat_set (GUI helper)
  blacklisting_accounts: Primitives.AccountId[]; // Flat_set

  cashback_vb?: Primitives.VestingBalanceId | null;

  // Special authority
  owner_special_authority?: unknown; // Usually no_special_authority
  active_special_authority?: unknown;
  top_n_control_flags?: number;

  allowed_assets?: Primitives.AssetId[] | null;

  // Extra visible fields observed on nodes
  num_committee_voted?: number;
  creation_block_num?: number;
  creation_time?: Primitives.TimePointSec;
}

// account_statistics_object (2.6.x)
export interface AccountStatisticsObject {
  id: Primitives.AccountStatisticsId;
  owner: Primitives.AccountId;
  name: string; // Duplicate for performance
  most_recent_op: Primitives.OperationHistoryId;
  total_ops: number;
  removed_ops: number;

  total_core_in_orders: Primitives.Int64String;
  core_in_balance: Primitives.Int64String;
  has_cashback_vb: boolean;

  is_voting: boolean;

  lifetime_fees_paid: Primitives.Int64String;
  pending_fees: Primitives.Int64String;
  pending_vested_fees: Primitives.Int64String;

  // Extra fields returned by some nodes (keep optional)
  total_core_inactive?: Primitives.Int64String;
  total_core_pob?: Primitives.Int64String;
  total_core_pol?: Primitives.Int64String;
  total_pob_value?: Primitives.Int64String;
  total_pol_value?: Primitives.Int64String;

  last_vote_time?: Primitives.TimePointSec;
  vp_all?: number;
  vp_active?: number;
  vp_committee?: number;
  vp_witness?: number;
  vp_worker?: number;
  vote_tally_time?: Primitives.TimePointSec;
}

// account_balance_object (2.x impl / 1.x via API) — comes as JSON
export interface AccountBalanceObject {
  id: Primitives.ObjectId; // Usually "2.5.x" (implementation object), but it's a object with id
  owner: Primitives.AccountId;
  asset_type: Primitives.AssetId;
  balance: Primitives.Int64String;
  maintenance_flag?: boolean;
}

// dynamic_global_property_object (2.1.0)
export interface DynamicGlobalPropertyObject {
  id: Primitives.ObjectId; // "2.1.0"
  head_block_number: number;
  head_block_id: string;
  time: Primitives.TimePointSec;

  current_witness: Primitives.WitnessId;

  // Counter of transactions in the current block
  current_transaction_in_block: number;
  current_virtual_time: string; // fc::uint128 => string

  // Maintenance parameters
  next_maintenance_time: Primitives.TimePointSec;
  last_budget_time: Primitives.TimePointSec;
  witness_budget: Primitives.Int64String;

  // Numbers of witnesses/skips
  last_irreversible_block_num: number;
  recent_slots_filled: string; // fc::uint128 => string
  dynamic_flags?: number;
  accounts_registered_this_interval?: number;

  // Contains many other fields; here are the main «visible» ones
}

// Full account (from get_full_accounts)
export interface FullAccount {
  account: AccountObject;
  statistics: AccountStatisticsObject;

  registrar_name: string;
  referrer_name: string;
  lifetime_referrer_name: string;

  votes: unknown[]; // vector<variant> (vote objects / ids)
  cashback_balance?: VestingBalanceObject | null;

  balances: AccountBalanceObject[];
  vesting_balances: VestingBalanceObject[];
  limit_orders: LimitOrderObject[];
  call_orders: CallOrderObject[];
  settle_orders: ForceSettlementObject[];
  proposals: ProposalObject[];
  assets: Primitives.AssetId[];

  // Legacy aggregate (kept for compatibility if you already used it)
  withdraws?: WithdrawPermissionObject[];

  // Fields observed in get_full_accounts responses on public nodes
  withdraws_from?: unknown[];
  withdraws_to?: unknown[];
  htlcs_from?: unknown[];
  htlcs_to?: unknown[];

  more_data_available?: FullAccountMoreDataAvailable;
}

// "more_data_available" flags set (pagination hints inside full_account)
export interface FullAccountMoreDataAvailable {
  balances: boolean;
  vesting_balances: boolean;
  limit_orders: boolean;
  call_orders: boolean;
  settle_orders: boolean;
  proposals: boolean;
  assets: boolean;
  withdraws_from: boolean;
  withdraws_to: boolean;
  htlcs_from: boolean;
  htlcs_to: boolean;
}

// Compact interfaces for nested objects in full_account,
// to avoid bloating the file. They can be extended as needed.

// vesting_balance_object (1.13.x)
export interface VestingBalanceObject {
  id: Primitives.VestingBalanceId;
  owner: Primitives.AccountId;
  balance: AssetAmount;
  // TODO: policy, vesting_period, etc.
  [k: string]: unknown;
}

// limit_order_object (1.7.x)
export interface LimitOrderObject {
  id: Primitives.LimitOrderId;
  seller: Primitives.AccountId;
  for_sale: Primitives.Int64String;
  sell_price: PriceLike;
  expiration: Primitives.TimePointSec;
  deferred_fee?: Primitives.Int64String;
  [k: string]: unknown; // TODO
}

// call_order_object (1.8.x)
export interface CallOrderObject {
  id: Primitives.CallOrderId;
  borrower: Primitives.AccountId;
  collateral: Primitives.Int64String;
  debt: Primitives.Int64String;
  call_price: PriceLike;
  [k: string]: unknown; // TODO
}

// force_settlement_object (1.4.x)
export interface ForceSettlementObject {
  id: Primitives.ForceSettlementId;
  owner: Primitives.AccountId;
  balance: AssetAmount;
  settlement_date: Primitives.TimePointSec;
  [k: string]: unknown; // TODO
}

// proposal_object (1.10.x)
export interface ProposalObject {
  id: Primitives.ProposalId;
  expiration_time: Primitives.TimePointSec;
  review_period_time?: Primitives.TimePointSec | null;
  proposed_transaction: unknown; // Signed_transaction-like
  required_active_approvals: Primitives.AccountId[];
  required_owner_approvals: Primitives.AccountId[];
  available_active_approvals: Primitives.AccountId[];
  available_owner_approvals: Primitives.AccountId[];
  available_key_approvals: Primitives.PublicKey[];
  [k: string]: unknown; // TODO
}

// withdraw_permission_object (1.12.x)
export interface WithdrawPermissionObject {
  id: Primitives.ObjectId;
  withdraw_from_account: Primitives.AccountId;
  authorized_account: Primitives.AccountId;
  withdrawal_limit: AssetAmount;
  withdrawal_period_sec: number;
  period_start_time: Primitives.TimePointSec;
  expiration: Primitives.TimePointSec;
  claimed_this_period: AssetAmount;
  [k: string]: unknown; // TODO
}

// Price base/quote (simplified)
export interface PriceLike {
  base: AssetAmount;
  quote: AssetAmount;
}

// Made for `get_objects`
export type AnyKnownObject =
  | AccountObject
  | AccountStatisticsObject
  | AccountBalanceObject
  | DynamicGlobalPropertyObject
  | VestingBalanceObject
  | LimitOrderObject
  | CallOrderObject
  | ForceSettlementObject
  | ProposalObject
  | WithdrawPermissionObject
  // Placeholder for other types
  | Record<string, unknown>;
