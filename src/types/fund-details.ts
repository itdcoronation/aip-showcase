export interface FundDetailsData {
  fundCode: string;
  fundName: string;
  fundLaunchDate: string;
  fundType: string;
  assetClass: string;
  riskProfile: string;
  benchmark: string;
  currency: string;
  accounting: string;
  incomeDistribution: string;
  minimumHoldingPeriod: string;
  minimumInitialTransaction: string;
  minimumAdditionalTransaction: string;
  managementFees: number;
  entryCharge: string;
  exitCharge: string;
  earlyRedemptionCharge: string;
  aboutFund: string;
  yieldType: string;
  yield: number;
  offerprice: number;
  logic: number;
  quarter: string;
  benchmarkReturn: number;
  ytdAtQuarterEnd: number;
  outperformance: number;
  expenseRatio: string;
  prospectus: string;
  trustdeed: string;
}

export interface FundDetailsResponse {
  Status: boolean;
  Code: string;
  Message: string;
  Data: FundDetailsData[];
  pagination: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
    has_next_page: boolean;
    has_previous_page: boolean;
  };
  filters_applied: {
    fund_filter: string;
    view_type: string;
    allowed_fund_codes: string[];
  };
  timestamp: string;
}