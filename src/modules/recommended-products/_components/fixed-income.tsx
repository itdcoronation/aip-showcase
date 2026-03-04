"use client";

import { FixedIncomeCard } from "@/components/cards/fixed-income-card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";

export const FixedIncome = () => {
  const router = useRouter();

  return (
    <section className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div>
          <p className="text-p2 text-txt-primary font-semibold mb-1">
            Fixed income
          </p>
          <p className="text-p4 text-txt-secondary">
            Write a better description for this section
          </p>
        </div>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="text-xs"
          onClick={() => router.push(ROUTES.fixed_income)}
        >
          See all
        </Button>
      </div>

      <div className="flex gap-4 overflow-auto w-full pb-2">
        <FixedIncomeCard />
        <FixedIncomeCard />
        <FixedIncomeCard />
        <FixedIncomeCard />
        <FixedIncomeCard />
        <FixedIncomeCard />
      </div>
    </section>
  );
};
