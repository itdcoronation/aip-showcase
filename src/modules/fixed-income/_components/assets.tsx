import { EmptyStateSvg } from "@/assets/vectors";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FixedIncomeTable } from "@/components/tables/fixed-income-table";
import { getFixedIncomeColumns } from "@/components/tables/fixed-income-table/columns";
import { useRouter } from "next/navigation";
import {
  fixedIncomeHistoryData,
  fixedIncomeRequestData,
  fixedIncomeTradesData,
} from "../showcase-data";

type Types = "trades" | "requests" | "history";

const Assets = () => {
  const router = useRouter();

  const [type, setType] = useState<Types>("trades");
  const columns = getFixedIncomeColumns({
    handleView: (id) => router.push(`/fixed-income/${id}?bought=true`),
    type: type,
  });

  const noFunds =
    fixedIncomeTradesData.length === 0 &&
    fixedIncomeRequestData.length === 0 &&
    fixedIncomeHistoryData.length === 0;

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
              {fixedIncomeTradesData.length > 0 ? (
                <FixedIncomeTable columns={columns} data={fixedIncomeTradesData} />
              ) : (
                <EmptyAssets />
              )}
            </TabsContent>
            <TabsContent value="requests">
              {fixedIncomeRequestData.length > 0 ? (
                <FixedIncomeTable columns={columns} data={fixedIncomeRequestData} />
              ) : (
                <EmptyAssets />
              )}
            </TabsContent>
            <TabsContent value="history">
              {fixedIncomeHistoryData.length > 0 ? (
                <FixedIncomeTable columns={columns} data={fixedIncomeHistoryData} />
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
