"use client";
import { Balance } from "@/components/cards/balance";
import { TopStockOptions } from "./_components/top-stock-options";
import { Button } from "@/components/ui/button";
import { PlusCircle, Wallet2 } from "lucide-react";
import { MarketClosedBanner } from "./_components/market-closed";
import { Assets } from "./_components/assets";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { useMemo } from "react";
import { getShowcaseEquitiesTotals } from "./showcase-data";

const EquitiesUI = () => {
  const router = useRouter();
  const { brokerageBalance, currentTotal, valueChangePercentage } =
    getShowcaseEquitiesTotals();

  // Format brokerage balance for display
  const brokerageAmount = useMemo(() => {
    return `₦ ${brokerageBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [brokerageBalance]);

  // Format investment balance for display
  const investmentAmount = useMemo(() => {
    return `₦ ${currentTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currentTotal]);

  // Get investment balance rate (value change percentage)
  const investmentRate = useMemo(() => {
    return valueChangePercentage;
  }, [valueChangePercentage]);

  const handleFund = () => {
    router.push(ROUTES.equities_fund);
  };
  const handleWithdraw = () => {
    router.push(ROUTES.equities_withdraw);
  };
  return (
    <>
      <section className="grid gap-12">
        <MarketClosedBanner />

        <div className="flex-col sm:flex-row flex gap-8 sm:gap-10">
          <Balance
            amount={brokerageAmount}
            title="Brokerage account"
            ctas={
              <>
                <div className="flex gap-2">
                  <Button onClick={handleFund} size={"sm"}>
                    Fund <PlusCircle size={16} />
                  </Button>
                  <Button
                    onClick={handleWithdraw}
                    size={"sm"}
                    variant={"outline"}
                  >
                    Withdraw <Wallet2 size={16} />
                  </Button>
                </div>
              </>
            }
          />
          <Balance 
            amount={investmentAmount} 
            title="Investment balance" 
            rate={investmentRate} 
          />
        </div>
        <TopStockOptions />
        <Assets />
      </section>
    </>
  );
};

export { EquitiesUI };
export * from "./explore-equities";
export * from "./equity";
export * from "./buy-stock";
export * from "./sell-stock";
export * from "./fund";
export * from "./withdraw";
