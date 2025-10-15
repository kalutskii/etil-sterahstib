// Graphene/Bitshares-specific types

export type ObjectId = string; // e.g. "1.2.345"
export type AccountId = string; // "1.2.x"
export type AssetId = string; // "1.3.x"
export type VestingBalanceId = string; // "1.13.x"
export type WitnessId = string; // "1.6.x"
export type CommitteeMemberId = string; // "1.5.x"
export type ProposalId = string; // "1.10.x"
export type CallOrderId = string; // "1.8.x"
export type ForceSettlementId = string; // "1.4.x"
export type LimitOrderId = string; // "1.7.x"
export type OperationHistoryId = string; // "1.11.x"
export type AccountStatisticsId = string; // "2.6.x"

export type Int64String = string; // Big integers from Graphene (share_type and others) — as strings

export type Address = string;
export type PublicKey = string; // e.g. "BTS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5SoY..."

export type TimePointSec = string; // ISO8601 or 'YYYY-MM-DDTHH:MM:SS'

export type URLLike = string | URL; // Just helper alias
