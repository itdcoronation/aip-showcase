import { StockCard } from "@/components/cards/stock-card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";

export const TopRecommendedStocks = () => {
  const router = useRouter();

  return (
    <section className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div>
          <p className="text-p3 text-txt-primary font-semibold">Products</p>
          {/* <p className="text-[11px] text-txt-secondary">
            A list of top recommended stocks on NGX
          </p> */}
        </div>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="text-xs"
          onClick={() => router.push(ROUTES.rec_products)}
        >
          See more
        </Button>
      </div>

      <div className="flex gap-4 overflow-auto w-full">
        <StockCard />
        <StockCard />
        <StockCard />
        <StockCard />
        <StockCard />
        <StockCard />
      </div>
    </section>
  );
};
