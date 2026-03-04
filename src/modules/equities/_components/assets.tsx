import { EmptyStateSvg } from "@/assets/vectors";
import { EquitiesTable } from "@/components/tables";
import { getEquityTableColumns } from "@/components/tables/equities-table/columns";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import {
  // EquityHistoryTableData,
  EquityTableData,
  // PendingEquityTableData,
} from "@/types/equity";
import { TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { mutualFundLogo } from "@/assets/images";
import { useState, useMemo } from "react";
import { NoticeModal } from "@/components/modals/notice-modal";
import { useFetchPortfolioFull } from "@/requests/services/portfolio/balance";
// import { useFetchPendingTrades } from "@/requests/services/equities/pending-trades";
// import { useFetchHistoryTrades } from "@/requests/services/equities/history-trades";





export const Assets = () => {
  // const router = useRouter();
  const [cancel, setCancel] = useState<string | undefined>();
  // const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [type, setType] = useState<"trade" | "pending" | "history">("trade");
  
  // Fetch portfolio data
  const { data: portfolioData, isLoading: portfolioLoading } = useFetchPortfolioFull();
  
  // Fetch pending trades data
  // const { data: pendingTradesData, isLoading: pendingTradesLoading } = useFetchPendingTrades();
  
  // Fetch history trades data
 // const { data: historyTradesData, isLoading: historyTradesLoading } = useFetchHistoryTrades();

  // Helper function to format date from API format to display format
  // const formatDate = (dateString: string): string => {
  //   const date = new Date(dateString);
  //   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  //   const day = date.getDate().toString().padStart(2, '0');
  //   const month = months[date.getMonth()];
  //   const year = date.getFullYear();
  //   return `${day} ${month}, ${year}`;
  // };

  // Transform userStocks data to match EquityTableData interface
  const transformedTradesData = useMemo((): EquityTableData[] => {
    if (!portfolioData?.data?.Data?.userStocks) return [];
    
    return portfolioData.data.Data.userStocks.map((stock) => ({
      id: stock.symbol,
      name: stock.name,
      short_form: stock.symbol,
      logo: stock.icon_url,
      purchase_price: Number(stock.buyPrice.toFixed(2)),
      curent_price: Number(stock.currentPrice.toFixed(2)),
      amount_invested: Number(stock.startValue.toFixed(2)),
      current_value: Number(stock.currentValue.toFixed(2)),
      gain_loss: stock.valueChange >= 0 
        ? `+ ₦ ${stock.valueChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        : `- ₦ ${Math.abs(stock.valueChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      units_held: stock.restQuantity,
      value_change: Number(stock.valueChangePercent.toFixed(2)),
    }));
  }, [portfolioData]);

  // Transform pending trades data to match PendingEquityTableData interface
  // const transformedPendingTradesData = useMemo((): PendingEquityTableData[] => {
  //   if (!pendingTradesData?.data?.data) return [];
  //   
  //   return pendingTradesData.data.data.map((trade) => ({
  //     id: `${trade.StockCode}-${trade.ID}`,
  //     name: trade.Name,
  //     short_form: trade.StockCode,
  //     logo: mutualFundLogo.src, // TODO: Add icon_url support when API provides it
  //     txn_date: formatDate(trade.TxnDate),
  //     txn_amount: Number(parseFloat(trade.QuotePrice).toFixed(2)),
  //     units: Number(parseFloat(trade.Qty)),
  //     txn_type: trade.TxnType.toLowerCase(),
  //   }));
  // }, [pendingTradesData]);

  // Transform history trades data to match EquityHistoryTableData interface
  // const transformedHistoryTradesData = useMemo((): EquityHistoryTableData[] => {
  //   if (!historyTradesData?.data?.data) return [];
  //   
  //   return historyTradesData.data.data.map((trade, index) => ({
  //     id: `${trade.Symbol}-${index}`,
  //     name: trade.Symbol, // Will be updated later when API adds company name
  //     short_form: trade.Symbol,
  //     logo: mutualFundLogo.src, // TODO: Add icon_url support when API provides it
  //     txn_date: formatDate(trade.TradeDate),
  //     txn_amount: Number(parseFloat(trade["Est. Amt"]).toFixed(2)),
  //     unit_price: Number(parseFloat(trade.UnitPrice).toFixed(2)),
  //     units: Number(parseFloat(trade.Qty)),
  //     txn_type: trade.TxnType.toLowerCase(),
  //     status: "successful", // Default to successful, will be updated in v2 API
  //   }));
  // }, [historyTradesData]);

  const columns = getEquityTableColumns({
    handleView: (/* id */) => {
      // TODO: Will be integrated in later sprints
      // router.push(`/equities/${id}?bought=true`);
      // setShowComingSoonModal(true);
    },
    handleCancel: setCancel,
    type: type,
  });

  const noEquities =
    transformedTradesData.length === 0;
    // transformedPendingTradesData.length === 0 &&
    // transformedHistoryTradesData.length === 0;

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
      {/* <NoticeModal
        show={showComingSoonModal}
        close={() => setShowComingSoonModal(false)}
        type="info"
        title="Coming Soon"
        description="This feature is coming soon"
        action={{
          text: "Ok",
          action: () => setShowComingSoonModal(false),
        }}
      /> */}
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
              {/* TODO: Will be displayed in future sprint */}
              {/* <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger> */}
            </TabsList>
            <TabsContent value="trade">
              {portfolioLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-txt-secondary">Loading trades...</p>
                </div>
              ) : transformedTradesData.length > 0 ? (
                <EquitiesTable columns={columns} data={transformedTradesData} />
              ) : (
                <EmptyAssets />
              )}
            </TabsContent>
            {/* TODO: Will be displayed in future sprint */}
            {/* <TabsContent value="pending">
              {pendingTradesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-txt-secondary">Loading pending trades...</p>
                </div>
              ) : transformedPendingTradesData.length > 0 ? (
                <EquitiesTable columns={columns} data={transformedPendingTradesData} />
              ) : (
                <EmptyAssets />
              )}
            </TabsContent>
             <TabsContent value="history">
              {historyTradesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-txt-secondary">Loading trade history...</p>
                </div>
              ) : transformedHistoryTradesData.length > 0 ? (
                <EquitiesTable columns={columns} data={transformedHistoryTradesData} />
              ) : (
                <EmptyAssets />
              )}
            </TabsContent> */}
          </Tabs>
        </section>
      )}
    </>
  );
};

const EmptyAssets = () => {
  const router = useRouter();
  // const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  // TODO: Will be integrated in later sprint
  const handleExploreEquities = () => {
    router.push(ROUTES.explore_equities);
    // setShowComingSoonModal(true);
  };

  return (
    <>
      {/* <NoticeModal
        show={showComingSoonModal}
        close={() => setShowComingSoonModal(false)}
        type="info"
        title="Coming Soon"
        description="This feature is coming soon"
        action={{
          text: "Ok",
          action: () => setShowComingSoonModal(false),
        }}
      /> */}
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
