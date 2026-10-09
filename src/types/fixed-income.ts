export interface TradesFixedIncomeTableData {
  id: string;
  name: string;
  short_form: string;
  logo: string;
  rate: number;
  amount_invested: number;
  txn_date: string;
  current_value: number;
  value_change: number;
  fund_type: string;
  discounted_value: number | null;
  remaining_amount: number;
  interest_reversal: number;
  purchase_timestamp: string;
}

export interface RequestsFixedIncomeTableData {
  id: string;
  name: string;
  short_form: string;
  logo: string;
  txn_date: string;
  txn_amount: number;
  rate: number;
  txn_type: string;
  fund_type: string;
  tenure: string;
}

export interface FixedIncomeHistoryTableData {
  id: string;
  name: string;
  short_form: string;
  logo: string;
  txn_date: string;
  txn_amount: number;
  rate: number;
  txn_type: string;
  status: string;
  discounted_value: number | null;
  remaining_amount: number | null;
  interest_reversal: number | null;
  purchase_timestamp: string | null;
}
