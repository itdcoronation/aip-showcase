import { EmptyStateSvg } from "@/assets/vectors";
import { EquitiesTable } from "@/components/tables";
import { getEquityTableColumns } from "@/components/tables/equities-table/columns";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import {
  EquityHistoryTableData,
  EquityTableData,
  PendingEquityTableData,
} from "@/types/equity";
import { TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { NoticeModal } from "@/components/modals/notice-modal";
import {
  showcaseEquityHistoryTableData,
  showcaseEquityTableData,
  showcasePendingEquityTableData,
} from "../showcase-data";





export const Assets = () => {
  const router = useRouter();
  const [cancel, setCancel] = useState<string | undefined>();
  const [type, setType] = useState<"trade" | "pending" | "history">("trade");

  const transformedTradesData: EquityTableData[] = showcaseEquityTableData;
  const transformedPendingTradesData: PendingEquityTableData[] =
    showcasePendingEquityTableData;
  const transformedHistoryTradesData: EquityHistoryTableData[] =
    showcaseEquityHistoryTableData;

  const columns = getEquityTableColumns({
    handleView: (id) => {
      router.push(`/equities/${id}?bought=true`);
    },
    handleCancel: setCancel,
    type: type,
  });

  const noEquities =
    transformedTradesData.length === 0 &&
    transformedPendingTradesData.length === 0 &&
    transformedHistoryTradesData.length === 0;

  return (
    <>
      <NoticeModal
        show={!!cancel}
        close={() => setCancel(undefined)}
        type="info"
        description="Your action has been handled in showcase mode."
        title="Action completed"
        action={{
          text: "OK",
          action: () => setCancel(undefined),
        }}
        secondaryAction={{
          text: "Close",
          action: () => setCancel(undefined),
        }}
      />
      {noEquities ? (
        <div className="bg-white shadow-sm border border-0.5 border-[#EEEFF1] py-12 px-4 rounded-[12px]">
          <EmptyAssets />
        </div>
      ) : (
        <section className="bg-white shadow-sm border border-0.5 border-[#EEEFF1] rounded-[12px] py-6 px-4 overflow-auto">
          <Tabs
            onValueChange={(value) =>
              setType(value as "trade" | "pending" | "history")
            }
            defaultValue="trade"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="trade">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="trade">
              {transformedTradesData.length > 0 ? (
                <EquitiesTable columns={columns} data={transformedTradesData} />
              ) : (
                <EmptyAssets />
              )}
            </TabsContent>
            <TabsContent value="pending">
              {transformedPendingTradesData.length > 0 ? (
                <EquitiesTable columns={columns} data={transformedPendingTradesData} />
              ) : (
                <EmptyAssets />
              )}
            </TabsContent>
            <TabsContent value="history">
              {transformedHistoryTradesData.length > 0 ? (
                <EquitiesTable columns={columns} data={transformedHistoryTradesData} />
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

const EmptyAssets = () => {
  const router = useRouter();

  const handleExploreEquities = () => {
    router.push(ROUTES.explore_equities);
  };

  return (
    <>
      <div className="flex flex-col h-full items-center justify-center gap-2">
        <EmptyStateSvg />
        <p className="text-p2 text-txt-primary font-semibold">
          You have no asset in your portfolio
        </p>
        <p className="text-l3 text-txt-secondary max-w-[280px] text-center">
          Buy a bit of your favorite companies and earn dividends when they
          succeed
        </p>
        <Button
          onClick={handleExploreEquities}
          size={"sm"}
          className="text-xs font-semibold mt-3"
        >
          Explore all equities
          <TrendingUp />
        </Button>
      </div>
    </>
  );
};
