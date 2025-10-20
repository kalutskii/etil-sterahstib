import type * as Primitives from '@/types/primitive.types';
import type { AssetAmount } from '@/types/structures.types';

// 0 — transfer_operation
export interface TransferOperation {
  from: Primitives.AccountId;
  to: Primitives.AccountId;
  amount: AssetAmount;
  memo?: {
    from: Primitives.PublicKey;
    to: Primitives.PublicKey;
    nonce: string;
    message: string; // Encrypted message as hex string
  } | null;
  extensions: unknown[];
}

// 1 — limit_order_create_operation
export interface LimitOrderCreateOperation {
  seller: Primitives.AccountId;
  amount_to_sell: AssetAmount;
  min_to_receive: AssetAmount;
  expiration: Primitives.TimePointSec;
  fill_or_kill: boolean;
  extensions: unknown[];
}

// 2 — limit_order_cancel_operation
export interface LimitOrderCancelOperation {
  fee_paying_account: Primitives.AccountId;
  order: Primitives.LimitOrderId;
  extensions: unknown[];
}

// 3 — call_order_update_operation (margin call)
export interface CallOrderUpdateOperation {
  funding_account: Primitives.AccountId;
  delta_collateral: AssetAmount;
  delta_debt: AssetAmount;
  extensions: unknown[];
}

// 4 — fill_order_operation (virtual)
export interface FillOrderOperation {
  account_id: Primitives.AccountId;
  pays: AssetAmount;
  receives: AssetAmount;
  fill_price: {
    base: AssetAmount;
    quote: AssetAmount;
  };
  is_maker: boolean;
}

// Maps operation_type (integer) → its corresponding structure.
// Unknown types fallback to a generic record and unknown.
export type OperationVariant =
  | { 0: TransferOperation }
  | { 1: LimitOrderCreateOperation }
  | { 2: LimitOrderCancelOperation }
  | { 3: CallOrderUpdateOperation }
  | { 4: FillOrderOperation }
  | Record<number, unknown>;

// Raw tuple representation used in RPC responses: [operation_type, operation_payload]
export type OperationTuple =
  | [0, TransferOperation]
  | [1, LimitOrderCreateOperation]
  | [2, LimitOrderCancelOperation]
  | [3, CallOrderUpdateOperation]
  | [4, FillOrderOperation]
  | [number, unknown]; // Fallback for untyped ops

// Tuple for results (JSON: [result_type, payload])
export type OperationResultTuple =
  | [0, null] // void_result
  | [1, AssetAmount] // asset_result
  | [2, Primitives.ObjectId] // object_result
  | [number, unknown]; // Fallback for untyped ops

// operation_history_object (1.11.x)
// Represents a single historical operation record stored in the BitShares blockchain.
export interface OperationHistoryObject {
  id: Primitives.OperationHistoryId; // "1.11.x"
  op: OperationTuple; // [operation_type, payload]
  result: OperationResultTuple; // [result_type, payload]
  block_num: number; // Block number
  trx_in_block: number; // Transaction index in block
  op_in_trx: number; // Operation index within transaction
  virtual_op: number; // 0 = normal operation, >0 = virtual
  block_time?: Primitives.TimePointSec; // Timestamp (if provided by node)
}

// A cleaner format for displaying or serializing history
// in the wallet — you can use it after parsing and formatting
export interface ParsedOperationHistory {
  id: Primitives.OperationHistoryId;
  type: number;
  operation:
  | TransferOperation
  | LimitOrderCreateOperation
  | LimitOrderCancelOperation
  | CallOrderUpdateOperation
  | FillOrderOperation
  | unknown;
  blockNum: number;
  timestamp?: Primitives.TimePointSec;
}
