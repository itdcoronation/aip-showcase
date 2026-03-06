import { StockCard } from "@/components/cards/stock-card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { showcaseStockDetails } from "../showcase-data";

export const TopStockOptions = () => {
  const router = useRouter();

  const handleExploreEquities = () => {
    router.push(ROUTES.explore_equities);
  };

  return (
    <>
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
        {showcaseStockDetails.slice(0, 6).map((stock) => (
          <StockCard
            key={stock.symbol}
            stockCode={stock.symbol}
            name={stock.name}
            price={stock.close}
            percentChange={stock.changePercent}
            iconUrl={stock.iconUrl}
          />
        ))}
      </div>
    </section>
    </>
  );
};
