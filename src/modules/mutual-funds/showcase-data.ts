import { mutualFundLogo } from "@/assets/images";
import {
  CompletedFundTableData,
  FundHistoryTableData,
  PendingFundTableData,
} from "@/types/mutual-fund";

export interface MutualFundShowcase {
  code: string;
  name: string;
  riskProfile: string;
  estimatedYield: number;
  currency: "NGN" | "USD";
  amountInvested: number;
  currentValue: number;
  about: string;
  benchmark: string;
  managementFee: string;
  minimumInitialTransaction: number;
  minimumAdditionalTransaction: number;
  minimumHoldingPeriod: string;
  assetClass: string;
  fundType: string;
  launchDate: string;
}

export interface MutualFundHistoryItem {
  description: string;
  valueDate: string;
  credit: number;
  debit: number;
}

export const showcaseMutualFunds: MutualFundShowcase[] = [
  {
    code: "COMMFUND",
    name: "Coronation Money Market Fund",
    riskProfile: "Low",
    estimatedYield: 14.2,
    currency: "NGN",
    amountInvested: 7200000,
    currentValue: 7640000,
    about:
      "A naira money market fund focused on capital preservation, liquidity, and steady short-term income.",
    benchmark: "Nigerian Treasury Bills Composite",
    managementFee: "1.00",
    minimumInitialTransaction: 5000,
    minimumAdditionalTransaction: 1000,
    minimumHoldingPeriod: "30 days",
    assetClass: "Money Market",
    fundType: "Open-ended Mutual Fund",
    launchDate: "2020-01-15",
  },
  {
    code: "CFIDFUND",
    name: "Coronation Fixed Income Dollar Fund",
    riskProfile: "Moderate",
    estimatedYield: 8.4,
    currency: "USD",
    amountInvested: 15000,
    currentValue: 15850,
    about:
      "A USD-denominated fixed income fund investing in high-quality sovereign and corporate debt instruments.",
    benchmark: "US SOFR + Spread",
    managementFee: "1.25",
    minimumInitialTransaction: 1000,
    minimumAdditionalTransaction: 500,
    minimumHoldingPeriod: "90 days",
    assetClass: "Fixed Income",
    fundType: "Open-ended Mutual Fund",
    launchDate: "2021-07-09",
  },
  {
    code: "CNGLEQTY",
    name: "Coronation Nigerian Equity Fund",
    riskProfile: "High",
    estimatedYield: 19.1,
    currency: "NGN",
    amountInvested: 9800000,
    currentValue: 11250000,
    about:
      "An equity-focused strategy investing in fundamentally strong, dividend-paying Nigerian listed companies.",
    benchmark: "NGX All Share Index",
    managementFee: "1.50",
    minimumInitialTransaction: 10000,
    minimumAdditionalTransaction: 5000,
    minimumHoldingPeriod: "180 days",
    assetClass: "Equity",
    fundType: "Open-ended Mutual Fund",
    launchDate: "2019-03-22",
  },
  {
    code: "CBALFUND",
    name: "Coronation Balanced Fund",
    riskProfile: "Moderate",
    estimatedYield: 15.3,
    currency: "NGN",
    amountInvested: 5100000,
    currentValue: 5560000,
    about:
      "A balanced portfolio blending fixed income and equities to target long-term growth with controlled volatility.",
    benchmark: "60/40 NGX ASI & NTB Blend",
    managementFee: "1.20",
    minimumInitialTransaction: 5000,
    minimumAdditionalTransaction: 1000,
    minimumHoldingPeriod: "90 days",
    assetClass: "Mixed Asset",
    fundType: "Open-ended Mutual Fund",
    launchDate: "2018-11-02",
  },
];

export const showcaseMutualFundCards = showcaseMutualFunds.map((fund) => ({
  id: fund.code,
  title: fund.name,
  riskProfile: fund.riskProfile,
  estimatedYield: fund.estimatedYield,
}));

export const showcaseCompletedFundData: CompletedFundTableData[] =
  showcaseMutualFunds.map((fund) => ({
    id: fund.code,
    name: fund.name,
    short_form: fund.code,
    logo: mutualFundLogo.src,
    est_yield: fund.estimatedYield,
    amount_invested: fund.amountInvested,
    txn_date: "24 Apr, 2025",
    current_value: fund.currentValue,
    value_change: Number(
      (((fund.currentValue - fund.amountInvested) / fund.amountInvested) * 100).toFixed(2)
    ),
  }));

export const showcasePendingFundData: PendingFundTableData[] = [
  {
    id: "PENDING-COMMFUND",
    name: "Coronation Money Market Fund",
    short_form: "COMMFUND",
    logo: mutualFundLogo.src,
    txn_date: "21 Jun, 2025",
    txn_amount: 450000,
    est_yield: 14.2,
    txn_type: "invest",
  },
];

export const showcaseFundHistoryData: FundHistoryTableData[] = [
  {
    id: "HIST-COMMFUND-1",
    name: "Coronation Money Market Fund",
    short_form: "COMMFUND",
    logo: mutualFundLogo.src,
    txn_date: "11 Apr, 2025",
    txn_amount: 350000,
    est_yield: 14.2,
    txn_type: "invest",
    status: "successful",
  },
  {
    id: "HIST-CNGLEQTY-1",
    name: "Coronation Nigerian Equity Fund",
    short_form: "CNGLEQTY",
    logo: mutualFundLogo.src,
    txn_date: "02 Mar, 2025",
    txn_amount: 200000,
    est_yield: 19.1,
    txn_type: "redeem",
    status: "successful",
  },
];

export const showcaseMutualFundHistoryByCode: Record<string, MutualFundHistoryItem[]> = {
  COMMFUND: [
    {
      description: "Initial subscription",
      valueDate: "2025-01-18",
      credit: 0,
      debit: 2500000,
    },
    {
      description: "Additional subscription",
      valueDate: "2025-03-03",
      credit: 0,
      debit: 1200000,
    },
    {
      description: "Dividend payout",
      valueDate: "2025-05-29",
      credit: 180000,
      debit: 0,
    },
  ],
  CNGLEQTY: [
    {
      description: "Initial subscription",
      valueDate: "2025-02-10",
      credit: 0,
      debit: 4000000,
    },
    {
      description: "Additional subscription",
      valueDate: "2025-04-22",
      credit: 0,
      debit: 2300000,
    },
    {
      description: "Partial redemption",
      valueDate: "2025-06-12",
      credit: 350000,
      debit: 0,
    },
  ],
};

export const getShowcaseMutualFund = (code?: string) => {
  if (!code) return showcaseMutualFunds[0];
  return showcaseMutualFunds.find((fund) => fund.code === code) || showcaseMutualFunds[0];
};

export const getShowcaseMutualFundTotals = () => {
  const ngnTotal = showcaseMutualFunds
    .filter((fund) => fund.currency === "NGN")
    .reduce((sum, fund) => sum + fund.currentValue, 0);
  const usdTotal = showcaseMutualFunds
    .filter((fund) => fund.currency === "USD")
    .reduce((sum, fund) => sum + fund.currentValue, 0);

  return { ngnTotal, usdTotal };
};
