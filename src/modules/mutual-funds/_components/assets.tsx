import { EmptyStateSvg } from "@/assets/vectors";
import { getMutualFundTableColumns } from "@/components/tables/mutual-funds-table/columns";
import {
  CompletedFundTableData,
  FundHistoryTableData,
  PendingFundTableData,
} from "@/types/mutual-fund";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MutualFundsTable } from "@/components/tables/mutual-funds-table";
import { NoticeModal } from "@/components/modals/notice-modal";
import {
  showcaseCompletedFundData,
  showcasePendingFundData,
  showcaseFundHistoryData,
} from "../showcase-data";

const Assets = () => {
  const router = useRouter();
  const [cancel, setCancel] = useState<string | undefined>();
  const [redeemRestrictionMessage, setRedeemRestrictionMessage] = useState<string | undefined>();
  const [type, setType] = useState<"active" | "pending" | "history">(
    "active"
  );
  const completedFundData: CompletedFundTableData[] = showcaseCompletedFundData;
  const pendingFundData: PendingFundTableData[] = showcasePendingFundData;
  const fundHistoryData: FundHistoryTableData[] = showcaseFundHistoryData;

  const columns = getMutualFundTableColumns({
    handleView: (id) => router.push(`/mutual-funds/${id}?bought=true`),
    handleCancel: setCancel,
    handleRedeemRestriction: (message) => setRedeemRestrictionMessage(message),
    type: type,
  });

  const noFunds = completedFundData.length === 0 && pendingFundData.length === 0 && fundHistoryData.length === 0;

  return (
    <>
      <NoticeModal
        show={!!cancel}
        close={() => setCancel(undefined)}
        type="failure"
        description="Write a better description for cancelling a sell or buy order"
        title="Are you sure you want to cancel?"
        action={{
          text: "Yes, Cancel",
          action: () => setCancel(undefined),
        }}
        secondaryAction={{
          text: "Close",
          action: () => setCancel(undefined),
        }}
      />
      <NoticeModal
        show={!!redeemRestrictionMessage}
        close={() => setRedeemRestrictionMessage(undefined)}
        type="info"
        title="Redeem Not Available"
        description={redeemRestrictionMessage || "This fund has redeem restrictions"}
        action={{
          text: "Ok",
          action: () => setRedeemRestrictionMessage(undefined),
        }}
      />
      {noFunds ? (
        <div className="bg-white shadow-sm border border-0.5 border-[#EEEFF1] py-12 px-4 rounded-[12px]">
          <EmptyAssets />
        </div>
      ) : (
        <section className="bg-white shadow-sm border border-0.5 border-[#EEEFF1] rounded-[12px] py-6 px-4 overflow-auto">
          <Tabs
            onValueChange={(value) =>
              setType(value as "active" | "pending" | "history")
            }
            defaultValue="active"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              {/* <TabsTrigger value="pending">Pending</TabsTrigger> */}
              {/* <TabsTrigger value="history">History</TabsTrigger> */}
            </TabsList>
            <TabsContent value="active">
              {completedFundData.length > 0 ? (
                <MutualFundsTable columns={columns} data={completedFundData} />
              ) : (
                <EmptyAssets />
              )}
            </TabsContent>
            <TabsContent value="pending">
              {pendingFundData.length > 0 ? (
                <MutualFundsTable columns={columns} data={pendingFundData} />
              ) : (
                <EmptyAssets />
              )}
            </TabsContent>
            <TabsContent value="history">
              {fundHistoryData.length > 0 ? (
                <MutualFundsTable columns={columns} data={fundHistoryData} />
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
        Select a fund above to start investing
      </p>
    </div>
  );
};
