"use client";
import { Balance } from "@/components/cards/balance";
import { MutualFunds } from "./_components/mutual-funds";
import { Assets } from "./_components/assets";
import { useFetchPortfolioFull } from "@/requests/services/portfolio";
import { formatCurrency } from "@/lib/utils";

const MutualFundsUI = () => {
  const { data: portfolioData, isLoading } = useFetchPortfolioFull();

  const ngnBalance =
    portfolioData?.data?.balance?.funds?.NGN_total_current_value || 0;
  const usdBalance =
    portfolioData?.data?.balance?.funds?.USD_total_current_value || 0;

  return (
    <>
      <section className="grid gap-12">
        <div className="flex-col sm:flex-row flex gap-8 sm:gap-10">
          <Balance
            amount={
              isLoading ? "Loading..." : formatCurrency(ngnBalance, "NGN")
            }
            title="Investment balance"
            // rate={0}
            isLoading={isLoading}
          />
          <Balance
            amount={
              isLoading ? "Loading..." : formatCurrency(usdBalance, "USD")
            }
            title="Investment balance"
            //rate={0}
            isLoading={isLoading}
          />
        </div>
        <MutualFunds />
        <Assets portfolioData={portfolioData} />
      </section>
    </>
  );
};

export { MutualFundsUI };
export * from "./fund";
export * from "./bought-fund";
export * from "./invest";
export * from "./redeem";
