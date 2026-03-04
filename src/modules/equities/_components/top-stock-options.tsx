import { StockCard } from "@/components/cards/stock-card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFetchTopGainers } from "@/requests/services/equities/balance";
//import { useState } from "react";
//import { NoticeModal } from "@/components/modals/notice-modal";

export const TopStockOptions = () => {
  const router = useRouter();
  // const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  
  // Fetch top gainers data
  const { data: topGainersData, isLoading: topGainersLoading, error } = useFetchTopGainers();

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
      <section className="overflow-hidden">
        <div className="flex-wrap flex items-center justify-between gap-2 mb-6">
          <div>
            <p className="text-p2 text-txt-primary font-semibold mb-1">
              Discover top stock options
            </p>
            <p className="text-p4 text-txt-secondary">
              A list of top gainers stocks on NGX
            </p>
          </div>
          <Button
            onClick={handleExploreEquities}
            size={"sm"}
            variant={"ghost"}
            className="text-xs bg-bg-secondary font-semibold"
          >
            Explore all equities
            <TrendingUp />
          </Button>
        </div>

      <div className="flex gap-4 overflow-auto w-full pb-2">
        {topGainersLoading ? (
          // Loading state - show skeleton cards
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="min-w-[136px] p-4 bg-white shadow-sm border-0.5 border-[#EEEFF1] rounded-[16px] animate-pulse">
              <div className="bg-gray-200 w-[40px] h-[40px] rounded-full mb-3"></div>
              <div className="bg-gray-200 h-4 w-full mb-1 rounded"></div>
              <div className="bg-gray-200 h-3 w-16 mb-3 rounded"></div>
              <div className="bg-gray-200 h-4 w-20 mb-1 rounded"></div>
              <div className="bg-gray-200 h-3 w-12 rounded"></div>
            </div>
          ))
        ) : error || !topGainersData?.data?.Data ? (
          // Error state - show fallback cards
          Array.from({ length: 6 }).map((_, index) => (
            <StockCard key={index} />
          ))
        ) : (
          // Render actual data
          topGainersData.data.Data.map((stock) => (
            <StockCard
              key={stock.id}
              stockCode={stock.stockCode}
              name={stock.name}
              price={stock.price}
              percentChange={stock.percentChange}
              iconUrl={stock.icon_url}
            />
          ))
        )}
      </div>
    </section>
    </>
  );
};
