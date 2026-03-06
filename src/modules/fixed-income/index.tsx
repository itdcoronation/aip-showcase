"use client";
import { Balance } from "@/components/cards/balance";
import { Assets } from "./_components/assets";
import { FixedIncomeCategories } from "./_components/categories";
import { useMemo } from "react";
import { fixedIncomeTradesData } from "./showcase-data";

const FixedIncomeUI = () => {
  const { investedTotal, currentTotal, performanceRate } = useMemo(() => {
    const invested = fixedIncomeTradesData.reduce(
      (sum, item) => sum + item.amount_invested,
      0
    );
    const current = fixedIncomeTradesData.reduce(
      (sum, item) => sum + item.current_value,
      0
    );

    const rate = invested > 0 ? ((current - invested) / invested) * 100 : 0;

    return {
      investedTotal: invested,
      currentTotal: current,
      performanceRate: Number(rate.toFixed(2)),
    };
  }, []);

  return (
    <>
      <section className="grid gap-12">
        <div className="flex-col sm:flex-row flex gap-8 sm:gap-10">
          <Balance
            amount={`₦ ${currentTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}`}
            title="Investment balance"
            rate={performanceRate}
          />
          <Balance
            amount={`₦ ${investedTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}`}
            title="Amount invested"
            rate={0}
          />
        </div>
        <FixedIncomeCategories />
        <Assets />
      </section>
    </>
  );
};

export { FixedIncomeUI };
export * from "./category";
export * from "./product";
