// Brokerage balance types
export interface BrokerageWallet {
  available_balance: number;
  current_balance: number;
  pending_balance: number;
  brokerage_balance: number;
  isBalanceAvailable: boolean;
}

export interface CosecAccount {
  accountID: string;
  sub: string;
  description: string;
  type: string;
  sumOfAmount: string;
}

export interface BrokerageBalanceData {
  Status: boolean;
  Code: string;
  Message: string;
  user_id: string;
  Data: {
    wallet: BrokerageWallet;
    cosec: CosecAccount[];
  };
  timestamp: string;
}

export interface BrokerageBalanceResponse {
  success: boolean;
  data: BrokerageBalanceData;
}

// Top gainers types
export interface TopGainerStock {
  id: string;
  submittedDate: string;
  stockCode: string;
  name: string;
  sector: string;
  lClose: string;
  price: string;
  date: string;
  change: string;
  percentChange: string;
  metricType: number;
  enviroment: number;
  isCacheData: boolean;
  icon_url: string | null;
}

export interface TopGainersSummary {
  total_gainers_available: number;
  gainers_returned: number;
  limit_applied: string;
  data_source: string;
}

export interface TopGainersMetadata {
  statusID: number;
  statusText: string;
  isCacheData: boolean;
}

export interface TopGainersData {
  Status: boolean;
  Code: string;
  Message: string;
  Data: TopGainerStock[];
  summary: TopGainersSummary;
  metadata: TopGainersMetadata;
  timestamp: string;
}

export interface TopGainersResponse {
  success: boolean;
  data: TopGainersData;
}

export interface EquityTableData {
  id: string;
  name: string;
  short_form: string;
  logo: string;
  purchase_price: number;
  curent_price: number;
  amount_invested: number;
  current_value: number;
  gain_loss: string;
  units_held: number;
  value_change: number;
}

// API response interface for pending trades
export interface PendingTradeApiData {
  StockCode: string;
  Name: string;
  TxnType: string;
  Qty: string;
  OrderDate: string;
  QuotePrice: string;
  LimitPrice: string;
  InTheMkt: string;
  ID: string;
  Status: string;
  TxnDate: string;
  DateLimit: string;
  MinQty: string;
  ExecInstDesc: string;
  ExecInst: string;
  Reason: string;
  TimeinForceDecs: string;
  TimeinForce: string;
  QtyRequested: string;
}

export interface PendingTradesApiResponse {
  success: boolean;
  status_id: number;
  status_message: string;
  data: PendingTradeApiData[];
  order_type: string;
  cust_aid: string;
}

export interface PendingTradesResponse {
  success: boolean;
  data: PendingTradesApiResponse;
}

// API response interface for history trades
export interface HistoryTradeApiData {
  TradeDate: string;
  Symbol: string;
  Qty: string;
  "Est. Amt": string;
  UnitPrice: string;
  TxnType: string;
}

export interface HistoryTradesApiResponse {
  success: boolean;
  status_id: number;
  status_message: string;
  data: HistoryTradeApiData[];
  order_type: string;
  cust_aid: string;
}

export interface HistoryTradesResponse {
  success: boolean;
  data: HistoryTradesApiResponse;
}

export interface PendingEquityTableData {
  id: string;
  name: string;
  short_form: string;
  logo: string;
  txn_date: string;
  txn_amount: number;
  units: number;
  txn_type: string;
}

export interface EquityHistoryTableData {
  id: string;
  name: string;
  short_form: string;
  logo: string;
  txn_date: string;
  txn_amount: number;
  unit_price: number;
  units: number;
  txn_type: string;
  status: string;
}

// Stock exploration types
export interface StockData {
  id: string;
  date: string;
  symbol: string;
  symbolOld: string;
  name: string;
  sector: string;
  pClose: string;
  open: string;
  high: string;
  low: string;
  spread: string;
  close: string;
  sign: string;
  change: string;
  volume: string;
  value: string;
  changePercent: string;
  averagePrice: string;
  weekHigh52: string;
  weekLow52: string;
  earningsPerShare: string;
  peRatio: string;
  mktSegment: string;
  isinCode: string;
  currency: string;
  iconUrl: string;
  isHidden: boolean;
}

export interface StocksPagination {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

export interface StocksFiltersApplied {
  symbol: string;
  sector: string;
  mktSegment: string;
}

export interface StocksSummary {
  total_stocks_available: number;
  total_stocks_filtered: number;
  stocks_on_current_page: number;
}

export interface StocksApiResponse {
  Status: boolean;
  Code: string;
  Message: string;
  Data: StockData[];
  pagination: StocksPagination;
  filters_applied: StocksFiltersApplied;
  summary: StocksSummary;
  timestamp: string;
}

export interface StocksExploreResponse {
  success: boolean;
  data: StocksApiResponse;
}

export interface StockExplorationState {
  allStocks: StockData[];
  displayedStocks: StockData[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  searchTerm: string;
  selectedSector: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  hasMorePages: boolean;
  error: string | null;
  availableSectors: string[];
}

// Stock details types
export interface StockDetailsData {
  id: string;
  date: string;
  symbol: string;
  symbolOld: string;
  name: string;
  sector: string;
  pClose: string;
  open: string;
  high: string;
  low: string;
  spread: string;
  close: string;
  sign: string;
  change: string;
  volume: string;
  value: string;
  changePercent: string;
  averagePrice: string;
  weekHigh52: string;
  weekLow52: string;
  earningsPerShare: string;
  peRatio: string;
  mktSegment: string;
  isinCode: string;
  currency: string;
  iconUrl: string;
  isHidden: boolean;
}

export interface StockDetailsApiResponse {
  Status: boolean;
  Code: string;
  Message: string;
  Data: StockDetailsData[];
  pagination: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
    has_next_page: boolean;
    has_previous_page: boolean;
  };
  filters_applied: {
    symbol: string;
    sector: string;
    mktSegment: string;
  };
  summary: {
    total_stocks_available: number;
    total_stocks_filtered: number;
    stocks_on_current_page: number;
  };
  timestamp: string;
}

export interface StockDetailsResponse {
  success: boolean;
  data: StockDetailsApiResponse;
}
