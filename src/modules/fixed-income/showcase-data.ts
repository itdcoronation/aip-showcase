import { mutualFundLogo } from "@/assets/images";
import {
  FixedIncomeHistoryTableData,
  RequestsFixedIncomeTableData,
  TradesFixedIncomeTableData,
} from "@/types/fixed-income";

export type FixedIncomeCategoryValue =
  | "bonds"
  | "commercial-papers"
  | "treasury-bills";

export interface FixedIncomeCategoryOption {
  label: string;
  value: FixedIncomeCategoryValue;
  description: string;
}

export interface FixedIncomeCategoryProduct {
  id: string;
  name: string;
  short_form: string;
  logo: string;
  category: FixedIncomeCategoryValue;
  type: "Bonds" | "Commercial Papers" | "Treasury bills";
  issuer: string;
  rate: number;
  tenure: string;
  shortDescription: string;
}

export const fixedIncomeTradesData: TradesFixedIncomeTableData[] = [
  {
    id: "1",
    name: "Dangote Cement Plc Commercial Paper Series 10",
    short_form: "DANGCP10",
    logo: mutualFundLogo.src,
    rate: 18.4,
    amount_invested: 12000000,
    txn_date: "24 Apr, 2025",
    current_value: 12720000,
    value_change: 6,
    fund_type: "Commercial Papers",
  },
  {
    id: "2",
    name: "FGN Savings Bond Mar 2027",
    short_form: "FGNSB27",
    logo: mutualFundLogo.src,
    rate: 16.2,
    amount_invested: 8000000,
    txn_date: "18 May, 2025",
    current_value: 8320000,
    value_change: 4,
    fund_type: "Bonds",
  },
  {
    id: "3",
    name: "182-Day Nigerian Treasury Bill",
    short_form: "NTB182",
    logo: mutualFundLogo.src,
    rate: 21.5,
    amount_invested: 15000000,
    txn_date: "30 Mar, 2025",
    current_value: 16050000,
    value_change: 7,
    fund_type: "Treasury bills",
  },
  {
    id: "5",
    name: "MTN Nigeria Commercial Paper Series 7",
    short_form: "MTNCP7",
    logo: mutualFundLogo.src,
    rate: 17.8,
    amount_invested: 10000000,
    txn_date: "06 Apr, 2025",
    current_value: 10450000,
    value_change: 4.5,
    fund_type: "Commercial Papers",
  },
];

export const fixedIncomeRequestData: RequestsFixedIncomeTableData[] = [
  {
    id: "1",
    name: "Airtel Africa Plc Commercial Paper Series 3",
    short_form: "AIRTCP3",
    logo: mutualFundLogo.src,
    txn_date: "24 Apr, 2025",
    txn_amount: 4000000,
    rate: 17.2,
    txn_type: "invest",
    tenure: "270 days",
    fund_type: "Commercial Papers",
  },
  {
    id: "2",
    name: "FGN Bond Apr 2029",
    short_form: "FGN29",
    logo: mutualFundLogo.src,
    txn_date: "18 May, 2025",
    txn_amount: 6000000,
    rate: 15.8,
    txn_type: "invest",
    tenure: "4 years",
    fund_type: "Bonds",
  },
  {
    id: "3",
    name: "364-Day Nigerian Treasury Bill",
    short_form: "NTB364",
    logo: mutualFundLogo.src,
    txn_date: "30 Mar, 2025",
    txn_amount: 3000000,
    rate: 22.1,
    txn_type: "redeem",
    tenure: "364 days",
    fund_type: "Treasury bills",
  },
  {
    id: "5",
    name: "BUA Foods Plc Commercial Paper Series 2",
    short_form: "BUACP2",
    logo: mutualFundLogo.src,
    txn_date: "06 Apr, 2025",
    txn_amount: 4500000,
    rate: 16.9,
    txn_type: "invest",
    tenure: "180 days",
    fund_type: "Commercial Papers",
  },
];

export const fixedIncomeHistoryData: FixedIncomeHistoryTableData[] = [
  {
    id: "1",
    name: "Zenith Bank Plc Commercial Paper Series 5",
    short_form: "ZENCP5",
    logo: mutualFundLogo.src,
    txn_date: "24 Apr, 2025",
    txn_amount: 7000000,
    rate: 15.9,
    txn_type: "invest",
    status: "successful",
  },
  {
    id: "2",
    name: "FGN Savings Bond Jan 2026",
    short_form: "FGNSB26",
    logo: mutualFundLogo.src,
    txn_date: "15 Mar, 2025",
    txn_amount: 3500000,
    rate: 14.7,
    txn_type: "redeem",
    status: "successful",
  },
  {
    id: "3",
    name: "91-Day Nigerian Treasury Bill",
    short_form: "NTB91",
    logo: mutualFundLogo.src,
    txn_date: "03 Feb, 2025",
    txn_amount: 2000000,
    rate: 19.3,
    txn_type: "invest",
    status: "canceled",
  },
  {
    id: "4",
    name: "Coronation Liquidity Management Account",
    short_form: "CLMA",
    logo: mutualFundLogo.src,
    txn_date: "29 Jan, 2025",
    txn_amount: 5000000,
    rate: 12.4,
    txn_type: "redeem",
    status: "successful",
  },
  {
    id: "5",
    name: "Access Bank Plc Commercial Paper Series 12",
    short_form: "ACCP12",
    logo: mutualFundLogo.src,
    txn_date: "11 Apr, 2025",
    txn_amount: 6500000,
    rate: 16.1,
    txn_type: "invest",
    status: "successful",
  },
];

export const fixedIncomeCategoryOptions: FixedIncomeCategoryOption[] = [
  {
    label: "Bonds",
    value: "bonds",
    description:
      "FGN and corporate bonds with predictable coupon income and medium-to-long-term tenors.",
  },
  {
    label: "Commercial papers",
    value: "commercial-papers",
    description:
      "Short-term corporate debt from top Nigerian issuers, typically 90 to 270 days.",
  },
  {
    label: "Treasury Bills",
    value: "treasury-bills",
    description:
      "Federal Government short-dated instruments focused on capital preservation and liquidity.",
  },
];

export const fixedIncomeCategoryProducts: FixedIncomeCategoryProduct[] = [
  {
    id: "2",
    name: "FGN Savings Bond Mar 2027",
    short_form: "FGNSB27",
    logo: mutualFundLogo.src,
    category: "bonds",
    type: "Bonds",
    issuer: "Debt Management Office (FGN)",
    rate: 16.2,
    tenure: "2 years",
    shortDescription: "Sovereign naira bond with fixed semi-annual coupon and low credit risk.",
  },
  {
    id: "6",
    name: "FGN Sovereign Sukuk 2031",
    short_form: "FGNSUK31",
    logo: mutualFundLogo.src,
    category: "bonds",
    type: "Bonds",
    issuer: "Debt Management Office (FGN)",
    rate: 15.4,
    tenure: "6 years",
    shortDescription: "Asset-backed sovereign issuance offering stable long-dated income.",
  },
  {
    id: "7",
    name: "Access Holdings Bond 2028",
    short_form: "ACCESS28",
    logo: mutualFundLogo.src,
    category: "bonds",
    type: "Bonds",
    issuer: "Access Holdings Plc",
    rate: 17.0,
    tenure: "3 years",
    shortDescription: "Corporate bond from a tier-one Nigerian financial institution.",
  },
  {
    id: "1",
    name: "Dangote Cement Plc Commercial Paper Series 10",
    short_form: "DANGCP10",
    logo: mutualFundLogo.src,
    category: "commercial-papers",
    type: "Commercial Papers",
    issuer: "Dangote Cement Plc",
    rate: 18.4,
    tenure: "180 days",
    shortDescription: "High-grade short-term corporate note for enhanced cash yield.",
  },
  {
    id: "5",
    name: "MTN Nigeria Commercial Paper Series 7",
    short_form: "MTNCP7",
    logo: mutualFundLogo.src,
    category: "commercial-papers",
    type: "Commercial Papers",
    issuer: "MTN Nigeria Communications Plc",
    rate: 17.8,
    tenure: "270 days",
    shortDescription: "Short-dated telecom issuance with competitive fixed return.",
  },
  {
    id: "8",
    name: "Flour Mills CP Series 4",
    short_form: "FMNCP4",
    logo: mutualFundLogo.src,
    category: "commercial-papers",
    type: "Commercial Papers",
    issuer: "Flour Mills of Nigeria Plc",
    rate: 16.7,
    tenure: "180 days",
    shortDescription: "Working-capital paper from a leading FMCG issuer in Nigeria.",
  },
  {
    id: "3",
    name: "182-Day Nigerian Treasury Bill",
    short_form: "NTB182",
    logo: mutualFundLogo.src,
    category: "treasury-bills",
    type: "Treasury bills",
    issuer: "Central Bank of Nigeria",
    rate: 21.5,
    tenure: "182 days",
    shortDescription: "Benchmark short-term sovereign security with strong liquidity.",
  },
  {
    id: "9",
    name: "364-Day Nigerian Treasury Bill",
    short_form: "NTB364",
    logo: mutualFundLogo.src,
    category: "treasury-bills",
    type: "Treasury bills",
    issuer: "Central Bank of Nigeria",
    rate: 22.1,
    tenure: "364 days",
    shortDescription: "Longer tenor T-bill for investors targeting higher annualized yield.",
  },
];
