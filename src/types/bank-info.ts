export interface MinorAccountTableData {
  id: string;
  account_name: string;
  email: string;
  gender: string;
  dob: string;
  date_created: string;
}
export interface BankAccountTableData {
  id: string;
  account_name: string;
  account_number: string;
  bank: string;
  date_added: string;
}

export interface CardsTableData {
  id: string;
  card_number: string;
  card_type: string;
  account_name: string;
  bank: string;
  date_added: string;
  expiration_date: string;
}

export interface InvestmentAccount {
  AccountNumber: string;
  AccountName: string;
  Status: string;
  BankName: string;
  ProductId: string;
}

export interface BankingInformation {
  BankAcctNumber: string;
  BankAcctName: string;
  BankCode: string;
  BankName: string;
  BranchCode: string | null;
  BankCodePlatform: string;
  BankCodePlatformCosec: string;
  BankCodePlatformCam: string;
}

export interface BankDetailsResponse {
  success: boolean;
  data: {
    investment_account: InvestmentAccount;
    banking_information: BankingInformation | null;
    user_id: string;
  };
}
