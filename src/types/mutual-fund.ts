export interface CompletedFundTableData {
  id: string;
  name: string;
  short_form: string;
  logo: string;
  est_yield: number;
  amount_invested: number;
  txn_date: string;
  current_value: number;
  value_change: number;
}

export interface PendingFundTableData {
  id: string;
  name: string;
  short_form: string;
  logo: string;
  txn_date: string;
  txn_amount: number;
  est_yield: number;
  txn_type: string;
}

export interface FundHistoryTableData {
  id: string;
  name: string;
  short_form: string;
  logo: string;
  txn_date: string;
  txn_amount: number;
  est_yield: number;
  txn_type: string;
  status: string;
}
