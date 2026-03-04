"use client";
import { Balance } from "@/components/cards/balance";
import { TopStockOptions } from "./_components/top-stock-options";
import { Button } from "@/components/ui/button";
import { PlusCircle, Wallet2 } from "lucide-react";
import { MarketClosedBanner } from "./_components/market-closed";
import { Assets } from "./_components/assets";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { useFetchBrokerageBalance } from "@/requests/services/equities/balance";
import { useFetchPortfolioFull } from "@/requests/services/portfolio/balance";
import { useMemo } from "react";

const EquitiesUI = () => {
  const router = useRouter();

  // Fetch brokerage balance data
  const { data: brokerageData, isLoading: brokerageLoading } = useFetchBrokerageBalance();

  // Fetch portfolio data for investment balance
  const { data: portfolioData, isLoading: portfolioLoading } = useFetchPortfolioFull();

  // Format brokerage balance for display
  const brokerageAmount = useMemo(() => {
    if (brokerageLoading) return "Loading...";
    
    const balance = brokerageData?.data?.Data?.wallet?.brokerage_balance;
    if (balance !== undefined && balance !== null) {
      return `₦ ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    return "₦ 0.00";
  }, [brokerageData, brokerageLoading]);

  // Format investment balance for display
  const investmentAmount = useMemo(() => {
    if (portfolioLoading) return "Loading...";
    
    const totalCurrentValue = portfolioData?.data?.balance?.stocks?.total_current_value;
    if (totalCurrentValue !== undefined && totalCurrentValue !== null) {
      return `₦ ${totalCurrentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    return "₦ 0.00";
  }, [portfolioData, portfolioLoading]);

  // Get investment balance rate (value change percentage)
  const investmentRate = useMemo(() => {
    if (portfolioLoading) return 0;
    
    const valueChangePercentage = portfolioData?.data?.balance?.stocks?.value_change_percentage;
    return valueChangePercentage || 0;
  }, [portfolioData, portfolioLoading]);

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
