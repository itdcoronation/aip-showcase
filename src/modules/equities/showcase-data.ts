import { mutualFundLogo } from "@/assets/images";
import {
  EquityHistoryTableData,
  EquityTableData,
  PendingEquityTableData,
} from "@/types/equity";

export interface ShowcaseStockDetail {
  symbol: string;
  name: string;
  sector: string;
  close: string;
  sign: "+" | "-";
  change: string;
  changePercent: string;
  volume: string;
  weekHigh52: string;
  weekLow52: string;
  peRatio: string;
  mktSegment: string;
  iconUrl: string;
  about: string;
}

export interface ShowcaseOwnedStock {
  symbol: string;
  name: string;
  sector: string;
  icon_url: string;
  buyPrice: number;
  currentPrice: number;
  startValue: number;
  currentValue: number;
  valueChange: number;
  valueChangePercent: number;
  restQuantity: number;
}

export const showcaseStockDetails: ShowcaseStockDetail[] = [
  {
    symbol: "DANGCEM",
    name: "Dangote Cement Plc",
    sector: "Industrial Goods",
    close: "675.20",
    sign: "+",
    change: "18.50",
    changePercent: "2.82",
    volume: "1324500",
    weekHigh52: "702.00",
    weekLow52: "498.60",
    peRatio: "13.8",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Dangote Cement is a leading cement producer in Africa with strong domestic and export market presence.",
  },
  {
    symbol: "MTNN",
    name: "MTN Nigeria Communications Plc",
    sector: "Telecommunications",
    close: "281.00",
    sign: "+",
    change: "4.20",
    changePercent: "1.52",
    volume: "2450000",
    weekHigh52: "310.00",
    weekLow52: "210.40",
    peRatio: "11.6",
    mktSegment: "Premium Board",
    iconUrl: mutualFundLogo.src,
    about:
      "MTN Nigeria is a dominant telecom operator providing mobile voice, data, and fintech services.",
  },
  {
    symbol: "ZENITHBANK",
    name: "Zenith Bank Plc",
    sector: "Banking",
    close: "52.30",
    sign: "+",
    change: "1.10",
    changePercent: "2.15",
    volume: "6840000",
    weekHigh52: "57.40",
    weekLow52: "34.10",
    peRatio: "5.3",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Zenith Bank is a tier-one Nigerian bank with strong profitability, capital base, and dividend track record.",
  },
  {
    symbol: "AIRTELAFRI",
    name: "Airtel Africa Plc",
    sector: "Telecommunications",
    close: "2380.00",
    sign: "-",
    change: "-24.00",
    changePercent: "-1.00",
    volume: "240000",
    weekHigh52: "2540.00",
    weekLow52: "1775.00",
    peRatio: "14.2",
    mktSegment: "Premium Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Airtel Africa provides mobile and money services across multiple African markets with resilient cashflow.",
  },
  {
    symbol: "ACCESSCORP",
    name: "Access Holdings Plc",
    sector: "Banking",
    close: "22.20",
    sign: "+",
    change: "0.90",
    changePercent: "4.23",
    volume: "9420000",
    weekHigh52: "25.90",
    weekLow52: "13.40",
    peRatio: "4.7",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Access Holdings is a diversified African financial services group with strong regional expansion.",
  },
  {
    symbol: "GTCO",
    name: "Guaranty Trust Holding Company Plc",
    sector: "Banking",
    close: "61.40",
    sign: "+",
    change: "1.20",
    changePercent: "1.99",
    volume: "7123000",
    weekHigh52: "67.80",
    weekLow52: "38.50",
    peRatio: "5.9",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "GTCO is a leading financial services group with strong digital banking and cross-border footprint.",
  },
  {
    symbol: "UBA",
    name: "United Bank for Africa Plc",
    sector: "Banking",
    close: "39.20",
    sign: "+",
    change: "0.80",
    changePercent: "2.08",
    volume: "10234000",
    weekHigh52: "42.50",
    weekLow52: "21.90",
    peRatio: "4.8",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "UBA operates a broad pan-African banking network with diversified retail and corporate revenue streams.",
  },
  {
    symbol: "FBNH",
    name: "FBN Holdings Plc",
    sector: "Banking",
    close: "28.50",
    sign: "-",
    change: "-0.30",
    changePercent: "-1.04",
    volume: "8450000",
    weekHigh52: "31.20",
    weekLow52: "16.70",
    peRatio: "4.2",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "FBN Holdings is a diversified financial holding company with strong legacy franchise in Nigeria.",
  },
  {
    symbol: "STANBIC",
    name: "Stanbic IBTC Holdings Plc",
    sector: "Banking",
    close: "82.00",
    sign: "+",
    change: "1.60",
    changePercent: "1.99",
    volume: "1640000",
    weekHigh52: "89.50",
    weekLow52: "49.20",
    peRatio: "7.1",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Stanbic IBTC combines investment banking, pensions, and retail banking under the Standard Bank group.",
  },
  {
    symbol: "FIDELITYBK",
    name: "Fidelity Bank Plc",
    sector: "Banking",
    close: "17.30",
    sign: "+",
    change: "0.50",
    changePercent: "2.98",
    volume: "11800000",
    weekHigh52: "18.90",
    weekLow52: "7.70",
    peRatio: "4.0",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Fidelity Bank is a growing Nigerian lender with expanding SME and digital banking capabilities.",
  },
  {
    symbol: "FCMB",
    name: "FCMB Group Plc",
    sector: "Banking",
    close: "11.80",
    sign: "-",
    change: "-0.10",
    changePercent: "-0.84",
    volume: "6240000",
    weekHigh52: "13.40",
    weekLow52: "5.40",
    peRatio: "3.9",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "FCMB Group provides banking, consumer finance, and investment management services across Nigeria.",
  },
  {
    symbol: "STERLINGNG",
    name: "Sterling Financial Holdings Company Plc",
    sector: "Banking",
    close: "6.90",
    sign: "+",
    change: "0.20",
    changePercent: "2.99",
    volume: "9540000",
    weekHigh52: "7.50",
    weekLow52: "3.20",
    peRatio: "4.4",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Sterling Financial Holdings focuses on retail banking and sector-specific financing in Nigeria.",
  },
  {
    symbol: "SEPLAT",
    name: "Seplat Energy Plc",
    sector: "Oil & Gas",
    close: "5020.00",
    sign: "+",
    change: "65.00",
    changePercent: "1.31",
    volume: "132000",
    weekHigh52: "5400.00",
    weekLow52: "3180.00",
    peRatio: "9.7",
    mktSegment: "Premium Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Seplat Energy is a major independent energy producer with upstream and gas processing assets.",
  },
  {
    symbol: "OANDO",
    name: "Oando Plc",
    sector: "Oil & Gas",
    close: "54.50",
    sign: "-",
    change: "-0.80",
    changePercent: "-1.45",
    volume: "3440000",
    weekHigh52: "62.90",
    weekLow52: "10.10",
    peRatio: "8.8",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Oando is an integrated energy group with upstream operations and energy trading capabilities.",
  },
  {
    symbol: "TOTAL",
    name: "TotalEnergies Marketing Nigeria Plc",
    sector: "Oil & Gas",
    close: "710.00",
    sign: "+",
    change: "8.00",
    changePercent: "1.14",
    volume: "210000",
    weekHigh52: "760.00",
    weekLow52: "420.00",
    peRatio: "10.3",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "TotalEnergies Marketing Nigeria operates downstream fuel and lubricant distribution nationwide.",
  },
  {
    symbol: "BUAFOODS",
    name: "BUA Foods Plc",
    sector: "Consumer Goods",
    close: "365.00",
    sign: "+",
    change: "7.20",
    changePercent: "2.01",
    volume: "980000",
    weekHigh52: "392.00",
    weekLow52: "211.00",
    peRatio: "17.9",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "BUA Foods is a leading food manufacturing company with flour, pasta, and sugar operations.",
  },
  {
    symbol: "BUACEMENT",
    name: "BUA Cement Plc",
    sector: "Industrial Goods",
    close: "156.50",
    sign: "-",
    change: "-1.10",
    changePercent: "-0.70",
    volume: "1140000",
    weekHigh52: "178.40",
    weekLow52: "93.20",
    peRatio: "15.1",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "BUA Cement is one of Nigeria's largest cement producers with national distribution reach.",
  },
  {
    symbol: "NESTLE",
    name: "Nestlé Nigeria Plc",
    sector: "Consumer Goods",
    close: "1260.00",
    sign: "+",
    change: "15.00",
    changePercent: "1.20",
    volume: "95000",
    weekHigh52: "1385.00",
    weekLow52: "780.00",
    peRatio: "20.4",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Nestlé Nigeria produces and distributes household food and beverage brands across the country.",
  },
  {
    symbol: "NB",
    name: "Nigerian Breweries Plc",
    sector: "Consumer Goods",
    close: "34.70",
    sign: "-",
    change: "-0.40",
    changePercent: "-1.14",
    volume: "2220000",
    weekHigh52: "42.30",
    weekLow52: "25.10",
    peRatio: "12.8",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Nigerian Breweries is a major beverage producer with a wide portfolio of premium and mainstream brands.",
  },
  {
    symbol: "INTBREW",
    name: "International Breweries Plc",
    sector: "Consumer Goods",
    close: "6.10",
    sign: "+",
    change: "0.10",
    changePercent: "1.67",
    volume: "3100000",
    weekHigh52: "7.40",
    weekLow52: "3.90",
    peRatio: "11.2",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "International Breweries produces beer and malt beverage brands with broad retail penetration.",
  },
  {
    symbol: "GUINNESS",
    name: "Guinness Nigeria Plc",
    sector: "Consumer Goods",
    close: "78.20",
    sign: "+",
    change: "1.80",
    changePercent: "2.36",
    volume: "460000",
    weekHigh52: "84.90",
    weekLow52: "48.10",
    peRatio: "14.4",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Guinness Nigeria is a prominent beverage company with stout, lager, and spirits offerings.",
  },
  {
    symbol: "DANGSUGAR",
    name: "Dangote Sugar Refinery Plc",
    sector: "Consumer Goods",
    close: "49.00",
    sign: "-",
    change: "-0.50",
    changePercent: "-1.01",
    volume: "1580000",
    weekHigh52: "56.00",
    weekLow52: "31.20",
    peRatio: "10.9",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Dangote Sugar is a leading sugar refinery and distributor serving industrial and retail demand.",
  },
  {
    symbol: "FLOURMILL",
    name: "Flour Mills of Nigeria Plc",
    sector: "Consumer Goods",
    close: "96.50",
    sign: "+",
    change: "2.00",
    changePercent: "2.12",
    volume: "740000",
    weekHigh52: "104.00",
    weekLow52: "61.30",
    peRatio: "8.9",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Flour Mills of Nigeria is a diversified food and agro-allied group with nationwide operations.",
  },
  {
    symbol: "CADBURY",
    name: "Cadbury Nigeria Plc",
    sector: "Consumer Goods",
    close: "23.10",
    sign: "+",
    change: "0.40",
    changePercent: "1.76",
    volume: "890000",
    weekHigh52: "26.20",
    weekLow52: "12.70",
    peRatio: "9.6",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Cadbury Nigeria manufactures confectionery and beverage products for the local market.",
  },
  {
    symbol: "UNILEVER",
    name: "Unilever Nigeria Plc",
    sector: "Consumer Goods",
    close: "19.40",
    sign: "-",
    change: "-0.20",
    changePercent: "-1.02",
    volume: "620000",
    weekHigh52: "22.50",
    weekLow52: "11.60",
    peRatio: "12.1",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Unilever Nigeria produces home and personal care products with strong household penetration.",
  },
  {
    symbol: "PZ",
    name: "PZ Cussons Nigeria Plc",
    sector: "Consumer Goods",
    close: "34.80",
    sign: "+",
    change: "0.60",
    changePercent: "1.75",
    volume: "530000",
    weekHigh52: "38.20",
    weekLow52: "14.40",
    peRatio: "10.5",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "PZ Cussons Nigeria is a consumer goods company focused on personal care and home care brands.",
  },
  {
    symbol: "LAFARGE",
    name: "Lafarge Africa Plc",
    sector: "Industrial Goods",
    close: "102.30",
    sign: "+",
    change: "2.10",
    changePercent: "2.10",
    volume: "1430000",
    weekHigh52: "110.00",
    weekLow52: "58.70",
    peRatio: "11.8",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Lafarge Africa is a major building materials company serving construction demand across Nigeria.",
  },
  {
    symbol: "WAPCO",
    name: "Lafarge Wapco Nigeria Plc",
    sector: "Industrial Goods",
    close: "101.80",
    sign: "-",
    change: "-0.80",
    changePercent: "-0.78",
    volume: "860000",
    weekHigh52: "109.50",
    weekLow52: "57.90",
    peRatio: "11.6",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Lafarge Wapco remains a key cement and aggregates player with broad infrastructure exposure.",
  },
  {
    symbol: "TRANSCORP",
    name: "Transnational Corporation Plc",
    sector: "Conglomerates",
    close: "19.90",
    sign: "+",
    change: "0.30",
    changePercent: "1.53",
    volume: "5020000",
    weekHigh52: "22.10",
    weekLow52: "6.80",
    peRatio: "7.2",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Transcorp is a diversified conglomerate with interests in power, hospitality, and energy.",
  },
  {
    symbol: "PRESCO",
    name: "Presco Plc",
    sector: "Agriculture",
    close: "520.00",
    sign: "+",
    change: "12.00",
    changePercent: "2.36",
    volume: "180000",
    weekHigh52: "560.00",
    weekLow52: "330.00",
    peRatio: "9.9",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Presco is an integrated palm oil producer with plantation and refining operations.",
  },
  {
    symbol: "NAHCO",
    name: "Nigerian Aviation Handling Company Plc",
    sector: "Services",
    close: "64.00",
    sign: "-",
    change: "-1.20",
    changePercent: "-1.84",
    volume: "410000",
    weekHigh52: "71.30",
    weekLow52: "29.40",
    peRatio: "8.5",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "NAHCO is a leading aviation ground handling services provider across major Nigerian airports.",
  },
  {
    symbol: "UCAP",
    name: "United Capital Plc",
    sector: "Financial Services",
    close: "36.50",
    sign: "+",
    change: "0.70",
    changePercent: "1.96",
    volume: "1630000",
    weekHigh52: "40.60",
    weekLow52: "17.20",
    peRatio: "6.8",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "United Capital is an investment banking and asset management group with broad retail participation.",
  },
  {
    symbol: "ETI",
    name: "Ecobank Transnational Incorporated",
    sector: "Banking",
    close: "31.20",
    sign: "+",
    change: "0.50",
    changePercent: "1.63",
    volume: "2210000",
    weekHigh52: "35.10",
    weekLow52: "16.90",
    peRatio: "4.6",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "ETI is a pan-African banking group with diversified operations across key African markets.",
  },
  {
    symbol: "WEMABANK",
    name: "Wema Bank Plc",
    sector: "Banking",
    close: "12.90",
    sign: "-",
    change: "-0.20",
    changePercent: "-1.53",
    volume: "3340000",
    weekHigh52: "14.80",
    weekLow52: "4.90",
    peRatio: "5.1",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Wema Bank is a Nigerian commercial bank known for its digital banking platform and SME focus.",
  },
  {
    symbol: "OKOMUOIL",
    name: "Okomu Oil Palm Company Plc",
    sector: "Agriculture",
    close: "435.00",
    sign: "+",
    change: "9.50",
    changePercent: "2.23",
    volume: "126000",
    weekHigh52: "472.00",
    weekLow52: "248.00",
    peRatio: "9.2",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Okomu Oil is a major agro-industrial company producing crude palm oil and rubber.",
  },
  {
    symbol: "JAPAULGOLD",
    name: "Japaul Gold & Ventures Plc",
    sector: "Services",
    close: "2.40",
    sign: "+",
    change: "0.10",
    changePercent: "4.35",
    volume: "12450000",
    weekHigh52: "2.80",
    weekLow52: "1.10",
    peRatio: "7.4",
    mktSegment: "Main Board",
    iconUrl: mutualFundLogo.src,
    about:
      "Japaul Gold & Ventures is a Nigerian diversified company with marine and industrial operations.",
  },
];

export const showcaseOwnedStocks: ShowcaseOwnedStock[] = [
  {
    symbol: "DANGCEM",
    name: "Dangote Cement Plc",
    sector: "Industrial Goods",
    icon_url: mutualFundLogo.src,
    buyPrice: 612.4,
    currentPrice: 675.2,
    startValue: 6124000,
    currentValue: 6752000,
    valueChange: 628000,
    valueChangePercent: 10.26,
    restQuantity: 10000,
  },
  {
    symbol: "MTNN",
    name: "MTN Nigeria Communications Plc",
    sector: "Telecommunications",
    icon_url: mutualFundLogo.src,
    buyPrice: 258.5,
    currentPrice: 281,
    startValue: 5170000,
    currentValue: 5620000,
    valueChange: 450000,
    valueChangePercent: 8.7,
    restQuantity: 20000,
  },
  {
    symbol: "ZENITHBANK",
    name: "Zenith Bank Plc",
    sector: "Banking",
    icon_url: mutualFundLogo.src,
    buyPrice: 45.1,
    currentPrice: 52.3,
    startValue: 4510000,
    currentValue: 5230000,
    valueChange: 720000,
    valueChangePercent: 15.96,
    restQuantity: 100000,
  },
];

export const showcaseEquityTableData: EquityTableData[] = showcaseOwnedStocks.map(
  (stock) => ({
    id: stock.symbol,
    name: stock.name,
    short_form: stock.symbol,
    logo: stock.icon_url,
    purchase_price: stock.buyPrice,
    curent_price: stock.currentPrice,
    amount_invested: stock.startValue,
    current_value: stock.currentValue,
    gain_loss:
      stock.valueChange >= 0
        ? `+ ₦ ${stock.valueChange.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : `- ₦ ${Math.abs(stock.valueChange).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
    units_held: stock.restQuantity,
    value_change: stock.valueChangePercent,
  })
);

export const showcasePendingEquityTableData: PendingEquityTableData[] = [
  {
    id: "PEND-ACCESS",
    name: "Access Holdings Plc",
    short_form: "ACCESSCORP",
    logo: mutualFundLogo.src,
    txn_date: "24 Jun, 2025",
    txn_amount: 22.2,
    units: 5000,
    txn_type: "buy",
  },
  {
    id: "PEND-MTNN",
    name: "MTN Nigeria Communications Plc",
    short_form: "MTNN",
    logo: mutualFundLogo.src,
    txn_date: "24 Jun, 2025",
    txn_amount: 281,
    units: 1200,
    txn_type: "buy",
  },
];

export const showcaseEquityHistoryTableData: EquityHistoryTableData[] = [
  {
    id: "HIST-DANGCEM",
    name: "Dangote Cement Plc",
    short_form: "DANGCEM",
    logo: mutualFundLogo.src,
    txn_date: "10 Jun, 2025",
    txn_amount: 3200000,
    unit_price: 640,
    units: 5000,
    txn_type: "buy",
    status: "successful",
  },
  {
    id: "HIST-ZENITH",
    name: "Zenith Bank Plc",
    short_form: "ZENITHBANK",
    logo: mutualFundLogo.src,
    txn_date: "30 May, 2025",
    txn_amount: 1400000,
    unit_price: 50,
    units: 28000,
    txn_type: "sell",
    status: "successful",
  },
];

export const getShowcaseStockDetail = (symbol?: string) => {
  if (!symbol) return showcaseStockDetails[0];
  return (
    showcaseStockDetails.find((stock) => stock.symbol === symbol) ||
    showcaseStockDetails[0]
  );
};

export const getShowcaseOwnedStock = (symbol?: string) => {
  if (!symbol) return showcaseOwnedStocks[0];
  return (
    showcaseOwnedStocks.find((stock) => stock.symbol === symbol) ||
    showcaseOwnedStocks[0]
  );
};

export const getShowcaseEquitiesTotals = () => {
  const currentTotal = showcaseOwnedStocks.reduce(
    (sum, item) => sum + item.currentValue,
    0
  );
  const investedTotal = showcaseOwnedStocks.reduce(
    (sum, item) => sum + item.startValue,
    0
  );

  const valueChangePercentage =
    investedTotal > 0
      ? Number((((currentTotal - investedTotal) / investedTotal) * 100).toFixed(2))
      : 0;

  return {
    brokerageBalance: 4500000,
    currentTotal,
    valueChangePercentage,
  };
};
