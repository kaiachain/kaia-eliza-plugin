export interface GetLatestBlockResponse {
  block_id: number;
}

export interface GetBlockResponse {
  block_id: number;
  datetime: string;
  hash: string;
  parent_hash: string;
  total_transaction_count: number;
  blockSize: number;
}

interface TransactionResponse {
  from: string;
  to: string;
  amount: number;
  transaction_type: string;
  transaction_hash: string;
}

export interface GetTransactionsByBlockNumber {
  results: TransactionResponse[];
}

export interface GetTransactionsByAccount extends GetTransactionsByBlockNumber {
}