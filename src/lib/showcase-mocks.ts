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
        first_name: "Mercy",
        last_name: "Nweke",
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
        status: "draft",
        completion_percentage: "",
        personal_info: false,
        bank_info: false,
        next_of_kin: false,
        kyc: false,
        risk_profile: false,
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

  if (url.includes("/api/onboarding/personal-info")) {
    return {
      success: true,
      message: "Personal information saved successfully",
      data: {
        staging_id: "SHOWCASE-STAGING-001",
        completion_percentage: "20",
        completion_status: {
          status: "draft",
          personal_info: true,
          bank_info: false,
          next_of_kin: false,
          kyc: false,
          risk_profile: false,
        },
      },
    };
  }

  if (url.includes("/api/onboarding/bank-info")) {
    return {
      success: true,
      message: "Bank information saved successfully",
      data: {
        staging_id: "SHOWCASE-STAGING-001",
        completion_percentage: "40",
        completion_status: {
          status: "draft",
          personal_info: true,
          bank_info: true,
          next_of_kin: false,
          kyc: false,
          risk_profile: false,
        },
      },
    };
  }

  if (url.includes("/api/onboarding/next-of-kin")) {
    return {
      success: true,
      message: "Next of kin information saved successfully",
      data: {
        staging_id: "SHOWCASE-STAGING-001",
        completion_percentage: "60",
        completion_status: {
          status: "draft",
          personal_info: true,
          bank_info: true,
          next_of_kin: true,
          kyc: false,
          risk_profile: false,
        },
      },
    };
  }

  if (url.includes("/api/onboarding/kyc")) {
    return {
      success: true,
      message: "KYC information saved successfully",
      data: {
        staging_id: "SHOWCASE-STAGING-001",
        completion_percentage: "80",
        completion_status: {
          status: "draft",
          personal_info: true,
          bank_info: true,
          next_of_kin: true,
          kyc: true,
          risk_profile: false,
        },
      },
    };
  }

  if (url.includes("/api/onboarding/risk-profile")) {
    return {
      success: true,
      message: "Risk profile saved successfully",
      data: {
        staging_id: "SHOWCASE-STAGING-001",
        completion_percentage: "100",
        completion_status: {
          status: "approved",
          personal_info: true,
          bank_info: true,
          next_of_kin: true,
          kyc: true,
          risk_profile: true,
        },
      },
    };
  }

  if (url.includes("/api/utils/states")) {
    return {
      success: true,
      message: "States retrieved successfully",
      data: [
        {
          id: 1,
          name: "Lagos",
          code: "LA",
          geopolitical_zone: "South West",
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
          category: "state",
          capital: "Ikeja",
          description: "Lagos State",
          created: "2024-01-01T00:00:00.000Z",
          area_km2: 3577,
          slogan: "Centre of Excellence",
        },
        {
          id: 2,
          name: "Abuja",
          code: "FC",
          geopolitical_zone: "North Central",
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
          category: "state",
          capital: "Abuja",
          description: "Federal Capital Territory",
          created: "2024-01-01T00:00:00.000Z",
          area_km2: 7315,
          slogan: "Centre of Unity",
        },
        {
          id: 3,
          name: "Ogun",
          code: "OG",
          geopolitical_zone: "South West",
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
          category: "state",
          capital: "Abeokuta",
          description: "Ogun State",
          created: "2024-01-01T00:00:00.000Z",
          area_km2: 16762,
          slogan: "Gateway State",
        },
        {
          id: 4,
          name: "Rivers",
          code: "RI",
          geopolitical_zone: "South South",
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
          category: "state",
          capital: "Port Harcourt",
          description: "Rivers State",
          created: "2024-01-01T00:00:00.000Z",
          area_km2: 11077,
          slogan: "Treasure Base of the Nation",
        },
      ],
      pagination: {
        current_page: 1,
        per_page: 50,
        total: 4,
        last_page: 1,
        from: 1,
        to: 4,
      },
      filters: {
        search: null,
        geopolitical_zone: null,
        category: "state",
      },
    };
  }

  if (url.includes("/api/utils/lgas")) {
    const stateCode = (body.state_code as string) || "LA";
    const lgaMap: Record<string, string[]> = {
      LA: [
        "Agege",
        "Ajeromi-Ifelodun",
        "Alimosho",
        "Amuwo-Odofin",
        "Apapa",
        "Badagry",
        "Epe",
        "Eti-Osa",
        "Ibeju-Lekki",
        "Ifako-Ijaiye",
        "Ikeja",
        "Ikorodu",
        "Kosofe",
        "Lagos Island",
        "Lagos Mainland",
        "Mushin",
        "Ojo",
        "Oshodi-Isolo",
        "Shomolu",
        "Surulere",
      ],
      FC: [
        "Abaji",
        "Abuja Municipal",
        "Bwari",
        "Gwagwalada",
        "Kuje",
        "Kwali",
      ],
      OG: [
        "Abeokuta North",
        "Abeokuta South",
        "Ado-Odo/Ota",
        "Ewekoro",
        "Ifo",
        "Ijebu East",
        "Ijebu North",
        "Ijebu Ode",
        "Ikenne",
        "Imeko Afon",
        "Ipokia",
        "Obafemi Owode",
        "Odogbolu",
        "Odeda",
        "Ogun Waterside",
        "Remo North",
        "Shagamu",
      ],
      RI: [
        "Abua/Odual",
        "Ahoada East",
        "Ahoada West",
        "Akuku-Toru",
        "Andoni",
        "Asari-Toru",
        "Bonny",
        "Degema",
        "Eleme",
        "Emohua",
        "Etche",
        "Gokana",
        "Ikwerre",
        "Khana",
        "Obio/Akpor",
        "Ogba/Egbema/Ndoni",
        "Ogu/Bolo",
        "Okrika",
        "Omuma",
        "Opobo/Nkoro",
        "Oyigbo",
        "Port Harcourt",
        "Tai",
      ],
    };

    const lgas = lgaMap[stateCode] || lgaMap["LA"];
    const stateNames: Record<string, string> = {
      LA: "Lagos",
      FC: "Abuja",
      OG: "Ogun",
      RI: "Rivers",
    };

    return {
      success: true,
      message: "LGAs retrieved successfully",
      data: {
        state_name: stateNames[stateCode] || "Lagos",
        state_code: stateCode,
        total_lgas: lgas.length,
        lgas,
      },
      filters: {
        search: null,
      },
    };
  }

  if (url.includes("/api/utils/banks")) {
    return {
      message: "Banks retrieved successfully",
      status: true,
      code: 200,
      data: [
        {
          id: 1,
          cbn_code: "000001",
          name: "Sterling Bank",
          slug: "sterling-bank",
          is_active: true,
          description: "Sterling Bank Plc",
          website: "https://www.sterling.ng",
          logo_url: "/coins.png",
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
        },
        {
          id: 2,
          cbn_code: "000002",
          name: "Keystone Bank",
          slug: "keystone-bank",
          is_active: true,
          description: "Keystone Bank Limited",
          website: "https://www.keystonebankng.com",
          logo_url: "/coins.png",
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
        },
        {
          id: 3,
          cbn_code: "000003",
          name: "First City Monument Bank",
          slug: "fcmb",
          is_active: true,
          description: "FCMB",
          website: "https://www.fcmb.com",
          logo_url: "/coins.png",
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
        },
        {
          id: 4,
          cbn_code: "000004",
          name: "United Bank for Africa",
          slug: "uba",
          is_active: true,
          description: "UBA Plc",
          website: "https://www.ubagroup.com",
          logo_url: "/coins.png",
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
        },
        {
          id: 5,
          cbn_code: "000005",
          name: "Access Bank",
          slug: "access-bank",
          is_active: true,
          description: "Access Bank Plc",
          website: "https://www.accessbankplc.com",
          logo_url: "/coins.png",
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
        },
        {
          id: 6,
          cbn_code: "000014",
          name: "Zenith Bank",
          slug: "zenith-bank",
          is_active: true,
          description: "Zenith Bank Plc",
          website: "https://www.zenithbank.com",
          logo_url: "/coins.png",
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
        },
        {
          id: 7,
          cbn_code: "000016",
          name: "Guaranty Trust Bank",
          slug: "gtbank",
          is_active: true,
          description: "GTBank / GTCO",
          website: "https://www.gtbank.com",
          logo_url: "/coins.png",
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
        },
      ],
      count: 7,
      timestamp: now(),
    };
  }

  if (url.includes("/api/utils/bank-name-inquiry")) {
    return {
      Status: true,
      Code: "00",
      Message: "Account name retrieved successfully",
      Data: {
        accountNumber: (body.accountNumber as string) || "1234567890",
        cbnCode: (body.cbnCode as string) || "000014",
        accountName: "Showcase User Account",
        statusID: 0,
        statusText: "Success",
      },
      timestamp: now(),
    };
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
        cosec: [
          {
            accountID: "7110359449",
            sub: "SHOWCASE-USER",
            description: "Brokerage Account",
            type: "virtual_account",
            sumOfAmount: "250000",
          },
        ],
      },
      timestamp: now(),
    });
  }

  if (url.includes("/api/equities/bank-details")) {
    return {
      success: true,
      message: "Bank details retrieved successfully",
      data: {
        user_id: "showcase-user",
        investment_account: {
          accountName: "Mercy Nweke",
          accountNumber: "7110359449",
          bankName: "Coronation Merchant Bank",
          AccountName: "Mercy Nweke",
          AccountNumber: "7110359449",
          BankName: "Coronation Merchant Bank",
        },
      },
      timestamp: now(),
    };
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

  // Insurance API mocks
  if (url.includes("/api/insurance/products")) {
    return {
      success: true,
      data: {
        third_party_motor_insurance: {
          private: {
            "Private Saloon": {
              product_code: "PTSN001",
              cover_code: "TPFT",
              premium: 15000,
              sum_insured: 1000000,
            },
            "Private SUV": {
              product_code: "PSUV001",
              cover_code: "TPFT",
              premium: 20000,
              sum_insured: 1500000,
            },
            "Private Van": {
              product_code: "PVAN001",
              cover_code: "TPFT",
              premium: 18000,
              sum_insured: 1200000,
            },
          },
          commercial: {
            "Commercial Bus": {
              product_code: "CBUS001",
              cover_code: "TPFT",
              premium: 25000,
              sum_insured: 2000000,
            },
            "Commercial Truck": {
              product_code: "CTRK001",
              cover_code: "TPFT",
              premium: 35000,
              sum_insured: 3000000,
            },
            "Commercial Van": {
              product_code: "CVAN001",
              cover_code: "TPFT",
              premium: 22000,
              sum_insured: 1800000,
            },
          },
        },
      },
    };
  }

  if (url.includes("/api/insurance/vehicle-lookup")) {
    return {
      success: true,
      data: {
        vehicleMake: "Toyota",
        vehicleModel: "Camry",
        productionYear: "2020",
        vinNumber: "JT2BF18K8X0123456",
        engineNumber: "2AZ1234567",
        color: "Silver",
      },
    };
  }

  if (url.includes("/api/insurance/policies/verify-payment")) {
    return {
      success: true,
      data: { status: "active", message: "Payment verified successfully" },
      message: "Payment verified successfully",
    };
  }

  if (url.includes("/api/insurance/policies/create")) {
    return {
      success: true,
      data: { id: 1001 },
      message: "Draft policy created successfully",
    };
  }

  if (url.match(/\/api\/insurance\/policies\/\d+\/update/)) {
    return {
      success: true,
      data: {},
      message: "Draft policy updated successfully",
    };
  }

  if (url.match(/\/api\/insurance\/policies\/\d+\/delete/)) {
    return {
      success: true,
      data: {},
      message: "Draft policy deleted successfully.",
    };
  }

  if (url.match(/\/api\/insurance\/policies\/\d+\/renew/)) {
    return {
      success: true,
      data: {},
      message: "Policy renewed successfully",
    };
  }

  if (url.match(/\/api\/insurance\/policies\/\d+\/download/)) {
    return {
      success: true,
      data: {
        download_url: {
          STATUS: "SUCCESS",
          DATA: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf",
          DATA2: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf",
          DESCRIPTION: "Policy certificate",
        },
      },
    };
  }

  if (url.match(/\/api\/insurance\/policies\/\d+$/)) {
    const policyId = url.split("/").pop() ?? "1001";
    return {
      success: true,
      data: {
        id: Number(policyId),
        start_date: "2025-03-26",
        end_date: "2026-03-26",
        status: "active",
        duration: 365,
        policy_number: `PMI-2025-${policyId}`,
        user_id: 1,
        type: "third_party_motor_insurance",
        insurance_policy_type_snapshot: {
          kind: "private",
          premium: 15000,
          cover_code: "TPFT",
          sum_insured: 1000000,
          product_code: "PTSN001",
          vehicle_type: "Private Saloon",
        },
        insurance_policy_payload: {
          vehicle: {
            color: "Silver",
            vin_number: "JT2BF18K8X0123456",
            vehicle_make: "Toyota",
            vehicle_type: "Private Saloon",
            engine_number: "2AZ1234567",
            vehicle_model: "Camry",
            license_number: "ABC-123-DE",
            production_year: 2020,
            proof_of_ownership_media_id: 1,
          },
          policyholder: {
            city: "Lagos",
            email: "showcase@demo.com",
            phone: "+2348012345678",
            state: "Lagos",
            title: "Mr",
            street: "123 Main Street",
            country: "Nigeria",
            last_name: "User",
            birth_date: "1990-01-15",
            first_name: "Showcase",
            middle_name: null,
            house_number: "45",
            identification_document_media_id: 2,
          },
        },
        paystack_transaction_reference: null,
        renew_insurance_policy_id: null,
        payment_date: "2025-03-26",
        processing_status: "Completed",
        processing_updated_at: "2025-03-26T10:00:00Z",
        deleted_at: null,
        created_at: "2025-03-25T09:00:00Z",
        updated_at: "2025-03-26T10:00:00Z",
        policy_media: [],
        media: [],
      },
    };
  }

  if (url.includes("/api/insurance/policies")) {
    const statusParam = url.includes("status%5B%5D=active") || url.includes("status[]=active");
    const isActive = statusParam || (!url.includes("status"));
    return {
      success: true,
      data: isActive
        ? [
            {
              id: 1001,
              start_date: "2025-03-26",
              end_date: "2026-03-26",
              status: "active",
              duration: 365,
              policy_number: "PMI-2025-1001",
              user_id: 1,
              type: "third_party_motor_insurance",
              insurance_policy_type_snapshot: {
                kind: "private",
                premium: 15000,
                cover_code: "TPFT",
                sum_insured: 1000000,
                product_code: "PTSN001",
                vehicle_type: "Private Saloon",
              },
              insurance_policy_payload: {
                vehicle: {
                  color: "Silver",
                  vin_number: "JT2BF18K8X0123456",
                  vehicle_make: "Toyota",
                  vehicle_type: "Private Saloon",
                  engine_number: "2AZ1234567",
                  vehicle_model: "Camry",
                  license_number: "ABC-123-DE",
                  production_year: 2020,
                  proof_of_ownership_media_id: 1,
                },
                policyholder: {
                  city: "Lagos",
                  email: "showcase@demo.com",
                  phone: "+2348012345678",
                  state: "Lagos",
                  title: "Mr",
                  street: "123 Main Street",
                  country: "Nigeria",
                  last_name: "User",
                  birth_date: "1990-01-15",
                  first_name: "Showcase",
                  middle_name: null,
                  house_number: "45",
                  identification_document_media_id: 2,
                },
              },
              paystack_transaction_reference: null,
              renew_insurance_policy_id: null,
              payment_date: "2025-03-26",
              processing_status: "Completed",
              processing_updated_at: "2025-03-26T10:00:00Z",
              deleted_at: null,
              created_at: "2025-03-25T09:00:00Z",
              updated_at: "2025-03-26T10:00:00Z",
              policy_media: [],
              media: [],
            },
            {
              id: 1002,
              start_date: "2025-02-15",
              end_date: "2026-02-15",
              status: "active",
              duration: 365,
              policy_number: "CMI-2025-1002",
              user_id: 1,
              type: "third_party_motor_insurance",
              insurance_policy_type_snapshot: {
                kind: "commercial",
                premium: 25000,
                cover_code: "TPFT",
                sum_insured: 2000000,
                product_code: "CBUS001",
                vehicle_type: "Commercial Bus",
              },
              insurance_policy_payload: {
                vehicle: {
                  color: "White",
                  vin_number: "NKS22XBUS0987654",
                  vehicle_make: "Mercedes",
                  vehicle_type: "Commercial Bus",
                  engine_number: "OM651B987654",
                  vehicle_model: "Sprinter",
                  license_number: "XYZ-789-FG",
                  production_year: 2019,
                  proof_of_ownership_media_id: 3,
                },
                policyholder: {
                  city: "Abuja",
                  email: "showcase@demo.com",
                  phone: "+2348012345678",
                  state: "FCT",
                  title: "Mr",
                  street: "456 Business Road",
                  country: "Nigeria",
                  last_name: "User",
                  birth_date: "1990-01-15",
                  first_name: "Showcase",
                  middle_name: null,
                  house_number: "12",
                  identification_document_media_id: 4,
                },
              },
              paystack_transaction_reference: null,
              renew_insurance_policy_id: null,
              payment_date: "2025-02-15",
              processing_status: "Completed",
              processing_updated_at: "2025-02-15T14:00:00Z",
              deleted_at: null,
              created_at: "2025-02-14T09:00:00Z",
              updated_at: "2025-02-15T14:00:00Z",
              policy_media: [],
              media: [],
            },
          ]
        : [
            {
              id: 1003,
              start_date: "2024-01-10",
              end_date: "2025-01-10",
              status: "expired",
              duration: 365,
              policy_number: "PMI-2024-1003",
              user_id: 1,
              type: "third_party_motor_insurance",
              insurance_policy_type_snapshot: {
                kind: "private",
                premium: 12000,
                cover_code: "TPFT",
                sum_insured: 800000,
                product_code: "PTSN001",
                vehicle_type: "Private Saloon",
              },
              insurance_policy_payload: {
                vehicle: {
                  color: "Blue",
                  vin_number: "JT3HV86R1X0456789",
                  vehicle_make: "Honda",
                  vehicle_type: "Private Saloon",
                  engine_number: "K20C456789",
                  vehicle_model: "Accord",
                  license_number: "LGS-456-KA",
                  production_year: 2018,
                  proof_of_ownership_media_id: 5,
                },
                policyholder: {
                  city: "Lagos",
                  email: "showcase@demo.com",
                  phone: "+2348012345678",
                  state: "Lagos",
                  title: "Mr",
                  street: "789 Old Street",
                  country: "Nigeria",
                  last_name: "User",
                  birth_date: "1990-01-15",
                  first_name: "Showcase",
                  middle_name: null,
                  house_number: "7",
                  identification_document_media_id: 6,
                },
              },
              paystack_transaction_reference: "PSTK-2024-ABC123",
              renew_insurance_policy_id: null,
              payment_date: "2024-01-10",
              processing_status: "Completed",
              processing_updated_at: "2024-01-10T09:00:00Z",
              deleted_at: null,
              created_at: "2024-01-09T09:00:00Z",
              updated_at: "2024-01-10T09:00:00Z",
              policy_media: [],
              media: [],
            },
            {
              id: 1004,
              start_date: null,
              end_date: null,
              status: "draft",
              duration: 365,
              policy_number: null,
              user_id: 1,
              type: "third_party_motor_insurance",
              insurance_policy_type_snapshot: {
                kind: "private",
                premium: 15000,
                cover_code: "TPFT",
                sum_insured: 1000000,
                product_code: "PTSN001",
                vehicle_type: "Private Saloon",
              },
              insurance_policy_payload: {
                vehicle: {
                  color: "Black",
                  vin_number: "YV1RS61R312345678",
                  vehicle_make: "Volvo",
                  vehicle_type: "Private Saloon",
                  engine_number: "B5254T3789012",
                  vehicle_model: "S60",
                  license_number: "ABJ-101-ZA",
                  production_year: 2021,
                  proof_of_ownership_media_id: 7,
                },
                policyholder: {
                  city: "Port Harcourt",
                  email: "showcase@demo.com",
                  phone: "+2348012345678",
                  state: "Rivers",
                  title: "Mr",
                  street: "22 New Estate",
                  country: "Nigeria",
                  last_name: "User",
                  birth_date: "1990-01-15",
                  first_name: "Showcase",
                  middle_name: null,
                  house_number: "3",
                  identification_document_media_id: 8,
                },
              },
              paystack_transaction_reference: null,
              renew_insurance_policy_id: null,
              payment_date: null,
              processing_status: "Pending",
              processing_updated_at: null,
              deleted_at: null,
              created_at: "2025-04-01T09:00:00Z",
              updated_at: "2025-04-01T09:00:00Z",
              policy_media: [],
              media: [],
            },
          ],
      pagination: {
        current_page: 1,
        per_page: 10,
        total: isActive ? 2 : 2,
        last_page: 1,
      },
    };
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
