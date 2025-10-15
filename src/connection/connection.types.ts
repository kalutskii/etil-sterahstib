// Wrapper type for JSON-RPC results
export type JsonRpcResult<T = unknown> = {
  jsonrpc: '2.0';
} & ({ result: T } | { error: { code: number; message: string; data?: unknown } });
