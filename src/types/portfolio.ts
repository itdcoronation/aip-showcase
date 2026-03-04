export interface PortfolioBalanceData {
  Status: boolean;
  Code: string;
  Message: string;
  user_id: string;
  type: string;
  balance: {
    stocks: {
      total_start_value: number;
      total_current_value: number;
      value_change_percentage: number;
    };
    funds: {
      NGN_total_current_value: number;
      USD_total_current_value: number;
    };
  };
  Data: null;
  timestamp: string;
}

export interface PortfolioBalanceResponse {
  success: boolean;
  data: PortfolioBalanceData;
}

export interface UserStock {
  symbol: string;
  startValue: number;
  sector: string;
  close: string;
  mktSegment: string;
  value: number;
  currentValue: number;
  valueChange: number;
  valueChangePercent: number;
  priceChange: number;
  priceChangePercent: number;
  profit: number;
  profit24h: number;
  buyPrice: number;
  currentPrice: number;
  currency: string;
  restQuantity: number;
  name: string;
  icon_url: string;
}

export interface UserFund {
  productName: string;
  productCode: string;
  productType: string;
  totalAssetValue: number;
  valuationDate: string;
}

export interface StocksBySector {
  sector: string;
  value: number;
  percent: number;
  symbols: string[];
}

export interface PortfolioFullData {
  Status: boolean;
  Code: string;
  Message: string;
  user_id: string;
  type: string;
  balance: {
    stocks: {
      total_start_value: number;
      total_current_value: number;
      value_change_percentage: number;
    };
    funds: {
      NGN_total_current_value: number;
      USD_total_current_value: number;
    };
  };
  Data: {
    userStocks: UserStock[];
    userFunds: UserFund[];
    stocksBySectors: StocksBySector[];
    userStockMetadata: {
      stockStartingValue: number;
    };
  };
  timestamp: string;
}

export interface PortfolioFullResponse {
  success: boolean;
  data: PortfolioFullData;
}