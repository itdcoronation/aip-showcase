import { EmptyStateSvg } from "@/assets/vectors";
import { getMutualFundTableColumns } from "@/components/tables/mutual-funds-table/columns";
import {
  CompletedFundTableData,
  FundHistoryTableData,
  PendingFundTableData,
} from "@/types/mutual-fund";
import { PortfolioFullResponse, UserFund } from "@/types/portfolio";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MutualFundsTable } from "@/components/tables/mutual-funds-table";
import { mutualFundLogo } from "@/assets/images";
import { NoticeModal } from "@/components/modals/notice-modal";

interface AssetsProps {
  portfolioData?: PortfolioFullResponse;
}

// Utility function to transform API data to table format
const transformUserFundsToTableData = (userFunds: UserFund[]): CompletedFundTableData[] => {
  return userFunds.map((fund, index) => ({
    id: fund.productCode || `fund-${index}`,
    name: fund.productName,
    short_form: fund.productCode,
    logo: mutualFundLogo.src,
    est_yield: 0, // Not available in API response
    amount_invested: 0, // Not available in API response - would need historical data
    txn_date: new Date(fund.valuationDate).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short', 
      year: 'numeric'
    }),
    current_value: parseFloat(fund.totalAssetValue.toFixed(2)),
    value_change: 0, // Would need historical data to calculate
  }));
};

const Assets = ({ portfolioData }: AssetsProps) => {
  const router = useRouter();
  const [cancel, setCancel] = useState<string | undefined>();
  const [redeemRestrictionMessage, setRedeemRestrictionMessage] = useState<string | undefined>();
  const [type, setType] = useState<"active" | "pending" | "history">(
    "active"
  );

  // Transform API data to table format
  const completedFundData = useMemo(() => {
    if (!portfolioData?.data?.Data?.userFunds) return [];
    return transformUserFundsToTableData(portfolioData.data.Data.userFunds);
  }, [portfolioData]);

  // Static data for pending and history (to be replaced when those APIs are available)
  const pendingFundData: PendingFundTableData[] = [];
  const fundHistoryData: FundHistoryTableData[] = [];

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
