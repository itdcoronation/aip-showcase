"use client";
import { Balance } from "@/components/cards/balance";
import { MutualFunds } from "./_components/mutual-funds";
import { Assets } from "./_components/assets";
import { formatCurrency } from "@/lib/utils";
import { getShowcaseMutualFundTotals } from "./showcase-data";

const MutualFundsUI = () => {
  const { ngnTotal, usdTotal } = getShowcaseMutualFundTotals();

  return (
    <>
      <section className="grid gap-12">
        <div className="flex-col sm:flex-row flex gap-8 sm:gap-10">
          <Balance amount={formatCurrency(ngnTotal, "NGN")} title="Investment balance" />
          <Balance amount={formatCurrency(usdTotal, "USD")} title="Investment balance" />
        </div>
        <MutualFunds />
        <Assets />
      </section>
    </>
  );
};

export { MutualFundsUI };
export * from "./fund";
export * from "./bought-fund";
export * from "./invest";
export * from "./redeem";
