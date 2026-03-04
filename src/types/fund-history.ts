export interface FundHistoryData {
  valueDate: string;
  description: string;
  credit: number;
  debit: number;
}

export interface FundHistoryResponse {
  Status: boolean;
  Code: string;
  Message: string;
  user_id: string;
  Data: FundHistoryData[];
  timestamp: string;
}