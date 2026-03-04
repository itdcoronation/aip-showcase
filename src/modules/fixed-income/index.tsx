"use client";
import { Balance } from "@/components/cards/balance";
import { Assets } from "./_components/assets";
import { FixedIncomeCategories } from "./_components/categories";

const FixedIncomeUI = () => {
  return (
    <>
      <section className="grid gap-12">
        <div className="flex-col sm:flex-row flex gap-8 sm:gap-10">
          <Balance amount="₦ 0.00" title="Investment balance" rate={0} />
          <Balance amount="$ 0.00" title="Investment balance" rate={0} />
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
