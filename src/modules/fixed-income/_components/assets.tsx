import { mutualFundLogo } from "@/assets/images";
import { EmptyStateSvg } from "@/assets/vectors";
import {
  FixedIncomeHistoryTableData,
  RequestsFixedIncomeTableData,
  TradesFixedIncomeTableData,
} from "@/types/fixed-income";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FixedIncomeTable } from "@/components/tables/fixed-income-table";
import { getFixedIncomeColumns } from "@/components/tables/fixed-income-table/columns";
import { useRouter } from "next/navigation";

const tradesData: TradesFixedIncomeTableData[] = [
  {
    id: "1",
    name: "Coronation Money Market Fund",
    short_form: "Coronation Wealth",
    logo: mutualFundLogo.src,
    rate: 6.5,
    amount_invested: 5000,
    txn_date: "24 Apr, 2025",
    current_value: 5350,
    value_change: 350,
    fund_type: "Treasury bills",
  },
  {
    id: "2",
    name: "Fidelity 500 Index Fund",
    short_form: "FXAIX",
    logo: mutualFundLogo.src,
    rate: 5.8,
    amount_invested: 3000,
    txn_date: "24 Apr, 2025",
    current_value: 3150,
    value_change: 150,
    fund_type: "Treasury bills",
  },
  {
    id: "3",
    name: "Schwab Total Stock Market Index Fund",
    short_form: "SWTSX",
    logo: mutualFundLogo.src,
    rate: 6.2,
    amount_invested: 4000,
    txn_date: "24 Apr, 2025",
    current_value: 4320,
    value_change: 320,
    fund_type: "Treasury bills",
  },
  {
    id: "4",
    name: "T. Rowe Price Blue Chip Growth Fund",
    short_form: "TRBCX",
    logo: mutualFundLogo.src,
    rate: 7.1,
    amount_invested: 2500,
    txn_date: "24 Apr, 2025",
    current_value: 2675,
    value_change: 175,
    fund_type: "Treasury bills",
  },
  {
    id: "5",
    name: "BlackRock Global Allocation Fund",
    short_form: "MDLOX",
    logo: mutualFundLogo.src,
    rate: 4.9,
    amount_invested: 3500,
    txn_date: "24 Apr, 2025",
    current_value: 3610,
    value_change: 110,
    fund_type: "Treasury bills",
  },
];
const requestData: RequestsFixedIncomeTableData[] = [
  {
    id: "1",
    name: "Coronation Money Market Fund",
    short_form: "Coronation Wealth",
    logo: mutualFundLogo.src,
    txn_date: "24 Apr, 2025",
    txn_amount: 3000,
    rate: 4.2,
    txn_type: "invest",
    tenure: "123 days",
    fund_type: "Treasury bills",
  },
  {
    id: "2",
    name: "Fidelity International Index Fund",
    short_form: "FSPSX",
    logo: mutualFundLogo.src,
    txn_date: "18 May, 2025",
    txn_amount: 1500,
    rate: 5.0,
    txn_type: "redeem",
    tenure: "123 days",
    fund_type: "Treasury bills",
  },
  {
    id: "3",
    name: "T. Rowe Price Dividend Growth Fund",
    short_form: "PRDGX",
    logo: mutualFundLogo.src,
    txn_date: "30 Mar, 2025",
    txn_amount: 2000,
    rate: 6.1,
    txn_type: "invest",
    tenure: "123 days",
    fund_type: "Treasury bills",
  },
  {
    id: "4",
    name: "Schwab S&P 500 Index Fund",
    short_form: "SWPPX",
    logo: mutualFundLogo.src,
    txn_date: "12 Jun, 2025",
    txn_amount: 2500,
    rate: 5.7,
    txn_type: "redeem",
    tenure: "123 days",
    fund_type: "Treasury bills",
  },
  {
    id: "5",
    name: "BlackRock Strategic Income Opportunities",
    short_form: "BSIIX",
    logo: mutualFundLogo.src,
    txn_date: "06 Apr, 2025",
    txn_amount: 1800,
    rate: 4.8,
    txn_type: "invest",
    tenure: "123 days",
    fund_type: "Treasury bills",
  },
];
const historyData: FixedIncomeHistoryTableData[] = [
  {
    id: "1",
    name: "Coronation Money Market Fund",
    short_form: "Coronation Wealth",
    logo: mutualFundLogo.src,
    txn_date: "24 Apr, 2025",
    txn_amount: 5000,
    rate: 7.2,
    txn_type: "invest",
    status: "successful",
  },
  {
    id: "2",
    name: "Fidelity 500 Index Fund",
    short_form: "FXAIX",
    logo: mutualFundLogo.src,
    txn_date: "15 Mar, 2025",
    txn_amount: 2500,
    rate: 6.5,
    txn_type: "redeem",
    status: "failed",
  },
  {
    id: "3",
    name: "T. Rowe Price Blue Chip Growth Fund",
    short_form: "TRBCX",
    logo: mutualFundLogo.src,
    txn_date: "03 Feb, 2025",
    txn_amount: 3500,
    rate: 8.1,
    txn_type: "invest",
    status: "canceled",
  },
  {
    id: "4",
    name: "Schwab International Index Fund",
    short_form: "SWISX",
    logo: mutualFundLogo.src,
    txn_date: "29 Jan, 2025",
    txn_amount: 4200,
    rate: 5.9,
    txn_type: "redeem",
    status: "successful",
  },
  {
    id: "5",
    name: "BlackRock Equity Dividend Fund",
    short_form: "MDDVX",
    logo: mutualFundLogo.src,
    txn_date: "11 Apr, 2025",
    txn_amount: 3100,
    rate: 6.4,
    txn_type: "invest",
    status: "successful",
  },
];

type Types = "trades" | "requests" | "history";

const Assets = () => {
  const router = useRouter();

  const [type, setType] = useState<Types>("trades");
  const columns = getFixedIncomeColumns({
    handleView: (id) => router.push(`/fixed-income/${id}?bought=true`),
    type: type,
  });

  const noFunds =
    tradesData.length === 0 &&
    requestData.length === 0 &&
    historyData.length === 0;

  return (
    <>
      {noFunds ? (
        <div className="bg-white shadow-sm border border-0.5 border-[#EEEFF1] py-12 px-4 rounded-[12px]">
          <EmptyAssets />
        </div>
      ) : (
        <section className="bg-white shadow-sm border border-0.5 border-[#EEEFF1] rounded-[12px] py-6 px-4 overflow-x-auto">
          <Tabs
            onValueChange={(value) => setType(value as Types)}
            defaultValue="trades"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="trades">Trades</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="trades">
              {tradesData.length > 0 ? (
                <FixedIncomeTable columns={columns} data={tradesData} />
              ) : (
                <EmptyAssets />
              )}
            </TabsContent>
            <TabsContent value="requests">
              {requestData.length > 0 ? (
                <FixedIncomeTable columns={columns} data={requestData} />
              ) : (
                <EmptyAssets />
              )}
            </TabsContent>
            <TabsContent value="history">
              {historyData.length > 0 ? (
                <FixedIncomeTable columns={columns} data={historyData} />
              ) : (
                <EmptyAssets />
              )}
            </TabsContent>
          </Tabs>
        </section>
      )}
    </>
  );
};

export { Assets };

const EmptyAssets = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-2">
      <EmptyStateSvg />
      <p className="text-p2 text-txt-primary font-semibold">
        You have no asset in your portfolio
      </p>
      <p className="text-l3 text-txt-secondary max-w-[280px] text-center">
        Select a product above to start investing
      </p>
    </div>
  );
};
