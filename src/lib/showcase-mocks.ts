"use client";

import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { isShowcaseMode } from "./showcase";

const ACCESS_TOKEN = "showcase-access-token";
const REFRESH_TOKEN = "showcase-refresh-token";

let hasInitialized = false;

const sampleStock = {
  id: "ZENITHBANK",
  date: "2026-03-04",
  symbol: "ZENITHBANK",
  symbolOld: "ZENITHBANK",
  name: "Zenith Bank Plc",
  sector: "Banking",
  pClose: "49.50",
  open: "49.80",
  high: "50.30",
  low: "49.40",
  spread: "0.90",
  close: "50.10",
  sign: "+",
  change: "0.60",
  volume: "2450000",
  value: "122745000",
  changePercent: "1.21",
  averagePrice: "50.10",
  weekHigh52: "54.30",
  weekLow52: "34.20",
  earningsPerShare: "5.42",
  peRatio: "9.24",
  mktSegment: "Main Board",
  isinCode: "NGZENITHBANK0",
  currency: "NGN",
  iconUrl: "/coins.png",
  icon_url: "/coins.png",
  stockCode: "ZENITHBANK",
  price: "50.10",
  percentChange: "+1.21",
  isHidden: false,
};

const sampleUserStock = {
  symbol: "ZENITHBANK",
  name: "Zenith Bank Plc",
  icon_url: "/coins.png",
  buyPrice: 45.5,
  currentPrice: 50.1,
  startValue: 455000,
  currentValue: 501000,
  valueChange: 46000,
  valueChangePercent: 10.11,
  restQuantity: 10000,
  sector: "Banking",
};

const sampleUserStock2 = {
  symbol: "GTCO",
  name: "GTCO Plc",
  icon_url: "/coins.png",
  buyPrice: 33.4,
  currentPrice: 35.2,
  startValue: 334000,
  currentValue: 352000,
  valueChange: 18000,
  valueChangePercent: 5.39,
  restQuantity: 10000,
  sector: "Banking",
};

const sampleUserFunds = [
  {
    productName: "Coronation Money Market Fund",
    productCode: "CMMFUND",
    productType: "naira",
    totalAssetValue: 425000,
    valuationDate: "2026-03-04",
  },
  {
    productName: "Coronation Dollar Fund",
    productCode: "CFIDFUND",
    productType: "dollar",
    totalAssetValue: 152000,
    valuationDate: "2026-03-04",
  },
];

const parseBody = (body: unknown) => {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body as Record<string, unknown>;
};

const now = () => new Date().toISOString();

const successEnvelope = (data: unknown) => ({
  success: true,
  status: "success",
  message: "Showcase response",
  data,
});

const getShowcaseData = (
  config: InternalAxiosRequestConfig
): Record<string, unknown> => {
  const url = (config.url ?? "").toLowerCase();
  const body = parseBody(config.data) as Record<string, unknown>;

  if (url.includes("/api/auth/sign-in")) {
    return {
      success: true,
      data: {
        token: ACCESS_TOKEN,
        refresh_token: REFRESH_TOKEN,
        expires_in: 3600,
        is_profile_complete: true,
        is_password_reset: true,
        is_email_confirmed: true,
      },
    };
  }

  if (url.includes("/api/auth/refresh")) {
    return {
      success: true,
      data: {
        token: ACCESS_TOKEN,
        refresh_token: REFRESH_TOKEN,
        expires_in: 3600,
        is_profile_complete: true,
      },
    };
  }

  if (url.includes("/api/auth/sign-up")) {
    return {
      status: true,
      message: "Signup successful",
      data: {
        email: body.email ?? "showcase@demo.com",
      },
      code: "200",
      errors: null,
    };
  }

  if (url.includes("/api/auth/verify-email") || url.includes("/api/auth/resend-otp")) {
    return {
      status: true,
      message: "Success",
      data: null,
      code: "200",
      errors: null,
    };
  }

  if (url.includes("/api/auth/forgot-password")) {
    return {
      success: true,
      data: {
        message: "Reset instructions sent",
      },
    };
  }

  if (url.includes("/api/auth/reset-password")) {
    return {
      success: true,
      message: "Password reset successful",
      data: null,
    };
  }

  if (url.includes("/api/token/seed")) {
    return successEnvelope({
      token: ACCESS_TOKEN,
      refresh_token: REFRESH_TOKEN,
      expires_in: 3600,
    });
  }

  if (url.includes("/api/user/profile")) {
    return successEnvelope({
      user: {
        email: "showcase@demo.com",
        bvn: "22334455667",
        phone_number: "+2348012345678",
        first_name: "Showcase",
        last_name: "User",
      },
    });
  }

  if (url.includes("/api/user/risk-profile")) {
    return {
      status: "success",
      message: "Showcase response",
      data: {
        risk_category: "moderate",
        risk_answers: {
          investment_horizon: "long_term",
          risk_tolerance: "medium",
        },
      },
    };
  }

  if (url.includes("/api/onboarding/initiate")) {
    return successEnvelope({
      staging_id: "SHOWCASE-STAGING-001",
      completion_status: {
        status: "approved",
        completion_percentage: "100",
        personal_info: true,
        bank_info: true,
        next_of_kin: true,
        kyc: true,
        risk_profile: true,
      },
    });
  }

  if (url.includes("/api/onboarding/user-data")) {
    return successEnvelope({
      id: "SHOWCASE-STAGING-001",
      account_type: "individual",
      first_name: "Showcase",
      last_name: "User",
      email: "showcase@demo.com",
    });
  }

  if (url.includes("/api/portfolio/balance")) {
    return successEnvelope({
      Status: true,
      Code: "00",
      Message: "Success",
      user_id: "showcase-user",
      type: "full",
      balance: {
        stocks: {
          total_start_value: 789000,
          total_current_value: 853000,
          value_change_percentage: 8.11,
        },
        funds: {
          NGN_total_current_value: 425000,
          USD_total_current_value: 152000,
        },
      },
      Data: null,
      timestamp: now(),
    });
  }

  if (url.includes("/api/portfolio/full")) {
    return successEnvelope({
      Status: true,
      Code: "00",
      Message: "Success",
      user_id: "showcase-user",
      type: "full",
      balance: {
        stocks: {
          total_start_value: 789000,
          total_current_value: 853000,
          value_change_percentage: 8.11,
        },
        funds: {
          NGN_total_current_value: 425000,
          USD_total_current_value: 152000,
        },
      },
      Data: {
        userStocks: [sampleUserStock, sampleUserStock2],
        userFunds: sampleUserFunds,
        stocksBySectors: [
          {
            sector: "Banking",
            value: 853000,
            percent: 100,
            symbols: ["ZENITHBANK", "GTCO"],
          },
        ],
        userStockMetadata: {
          stockStartingValue: 789000,
        },
      },
      timestamp: now(),
    });
  }

  if (url.includes("/api/products/fact-sheet")) {
    return {
      Code: "00",
      Message: "Success",
      Status: true,
      timestamp: now(),
      Data: [
        {
          aboutFund: "Showcase mutual fund description",
          accounting: "Daily",
          assetClass: "Money Market",
          benchmark: "NITTY",
          benchmarkReturn: 12.4,
          currency: "NGN",
          earlyRedemptionCharge: "0%",
          entryCharge: "0%",
          exitCharge: "0%",
          expenseRatio: "1.20%",
          fundCode: "CMMFUND",
          fundLaunchDate: "2022-01-01",
          fundName: "Coronation Money Market Fund",
          fundType: "naira",
          incomeDistribution: "Quarterly",
          logic: 0,
          managementFees: 1.2,
          minimumAdditionalTransaction: "1000",
          minimumHoldingPeriod: "30 days",
          minimumInitialTransaction: "5000",
          offerprice: 100,
          outperformance: 2.1,
          prospectus: "https://example.com/showcase-prospectus.pdf",
          quarter: "Q1",
          riskProfile: "Low",
          trustdeed: "https://example.com/showcase-trustdeed.pdf",
          yield: 11.23,
          yieldType: "annual",
          ytdAtQuarterEnd: 3.1,
        },
        {
          aboutFund: "Showcase dollar fund description",
          accounting: "Daily",
          assetClass: "Fixed Income",
          benchmark: "SOFR",
          benchmarkReturn: 6.7,
          currency: "USD",
          earlyRedemptionCharge: "0%",
          entryCharge: "0%",
          exitCharge: "0%",
          expenseRatio: "1.00%",
          fundCode: "CFIDFUND",
          fundLaunchDate: "2021-06-01",
          fundName: "Coronation Dollar Fund",
          fundType: "dollar",
          incomeDistribution: "Quarterly",
          logic: 0,
          managementFees: 1,
          minimumAdditionalTransaction: "100",
          minimumHoldingPeriod: "30 days",
          minimumInitialTransaction: "500",
          offerprice: 100,
          outperformance: 1.1,
          prospectus: "https://example.com/showcase-prospectus-usd.pdf",
          quarter: "Q1",
          riskProfile: "Moderate",
          trustdeed: "https://example.com/showcase-trustdeed-usd.pdf",
          yield: 6.42,
          yieldType: "annual",
          ytdAtQuarterEnd: 1.7,
        },
      ],
      pagination: {
        current_page: 1,
        has_next_page: false,
        has_previous_page: false,
        per_page: 10,
        total_items: 2,
        total_pages: 1,
      },
      filters_applied: {
        fund_filter: "",
        view_type: "",
        allowed_fund_codes: ["CMMFUND", "CFIDFUND"],
      },
    };
  }

  if (url.includes("/api/equities/balance")) {
    return successEnvelope({
      Status: true,
      Code: "00",
      Message: "Success",
      user_id: "showcase-user",
      Data: {
        wallet: {
          available_balance: 250000,
          current_balance: 260000,
          pending_balance: 10000,
          brokerage_balance: 250000,
          isBalanceAvailable: true,
        },
        cosec: [],
      },
      timestamp: now(),
    });
  }

  if (url.includes("/api/equities/top-gainers")) {
    return successEnvelope({
      Status: true,
      Code: "00",
      Message: "Success",
      Data: [sampleStock, { ...sampleStock, id: "GTCO", symbol: "GTCO", stockCode: "GTCO", name: "GTCO Plc" }],
      summary: {
        total_gainers_available: 2,
        gainers_returned: 2,
        limit_applied: "2",
        data_source: "showcase",
      },
      metadata: {
        statusID: 0,
        statusText: "Success",
        isCacheData: false,
      },
      timestamp: now(),
    });
  }

  if (url.includes("/api/equities/explore") || url.includes("/api/equities/stock-details")) {
    const symbol = (body.symbol as string) || sampleStock.symbol;
    const resultStock = { ...sampleStock, symbol, stockCode: symbol, id: symbol };

    return successEnvelope({
      Status: true,
      Code: "00",
      Message: "Success",
      Data: [resultStock],
      pagination: {
        current_page: 1,
        per_page: 100,
        total_items: 1,
        total_pages: 1,
        has_next_page: false,
        has_previous_page: false,
      },
      filters_applied: {
        symbol,
        sector: "",
        mktSegment: "",
      },
      summary: {
        total_stocks_available: 1,
        total_stocks_filtered: 1,
        stocks_on_current_page: 1,
      },
      timestamp: now(),
    });
  }

  if (url.includes("/api/equities/pending")) {
    return {
      success: true,
      data: {
        success: true,
        status_id: 200,
        status_message: "Success",
        data: [
          {
            StockCode: "ZENITHBANK",
            Name: "Zenith Bank Plc",
            TxnType: "buy",
            Qty: "1200",
            OrderDate: now(),
            QuotePrice: "50.10",
            LimitPrice: "50.10",
            InTheMkt: "Y",
            ID: "PENDING-1",
            Status: "pending",
            TxnDate: now(),
            DateLimit: now(),
            MinQty: "1",
            ExecInstDesc: "",
            ExecInst: "",
            Reason: "",
            TimeinForceDecs: "",
            TimeinForce: "",
            QtyRequested: "1200",
          },
        ],
        order_type: "pending",
        cust_aid: "showcase-cust",
      },
    };
  }

  if (url.includes("/api/equities/history")) {
    return {
      success: true,
      data: {
        success: true,
        status_id: 200,
        status_message: "Success",
        data: [
          {
            TradeDate: now(),
            Symbol: "ZENITHBANK",
            Qty: "800",
            "Est. Amt": "40080",
            UnitPrice: "50.10",
            TxnType: "buy",
          },
        ],
        order_type: "history",
        cust_aid: "showcase-cust",
      },
    };
  }

  if (url.includes("/api/payments/initiate")) {
    return successEnvelope({
      checkoutUrl: "https://example.com/showcase-checkout",
      reference: "SHOWCASE-PAYMENT-001",
      status: "initiated",
    });
  }

  return {
    success: true,
    status: "success",
    message: "Showcase response",
    data: {
      id: "showcase-placeholder",
      Data: [],
      items: [],
      balance: {
        stocks: {
          total_current_value: 0,
          value_change_percentage: 0,
        },
        funds: {
          NGN_total_current_value: 0,
          USD_total_current_value: 0,
        },
      },
      user: {
        email: "showcase@demo.com",
        first_name: "Showcase",
        last_name: "User",
      },
    },
  };
};

export const initializeShowcaseMocks = () => {
  if (!isShowcaseMode || hasInitialized || typeof window === "undefined") {
    return;
  }

  hasInitialized = true;

  if (!Cookies.get("access_token")) {
    Cookies.set("access_token", ACCESS_TOKEN, { sameSite: "Strict" });
  }

  if (!Cookies.get("refresh_token")) {
    Cookies.set("refresh_token", REFRESH_TOKEN, { sameSite: "Strict" });
  }

  axios.interceptors.request.use((config) => {
    const requestUrl = config.url ?? "";
    if (!requestUrl.includes("/api/")) {
      return config;
    }

    config.adapter = async () => {
      const data = getShowcaseData(config);
      return {
        data,
        status: 200,
        statusText: "OK",
        headers: new AxiosHeaders(),
        config,
        request: {},
      };
    };

    return config;
  });

  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    if (!url.includes("/api/")) {
      return nativeFetch(input, init);
    }

    const requestConfig = {
      url,
      data: init?.body,
    } as InternalAxiosRequestConfig;

    const data = getShowcaseData(requestConfig);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
};
