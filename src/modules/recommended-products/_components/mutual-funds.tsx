"use client";
import { MutualFundCard } from "@/components/cards/mutual-fund-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchFactSheet } from "@/requests/services/products/fact-sheet";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export const MutualFunds = () => {
  const [page, setPage] = useState(1);

  const { data, isPending } = useFetchFactSheet({
    params: { page, per_page: 4 },
  });

  const handlePrev = () => {
    if (page > 1 && data && data.pagination.has_previous_page) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (data && data.pagination.has_next_page) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <section className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div>
          <p className="text-p2 text-txt-primary font-semibold mb-1">
            Mutual funds
          </p>
          <p className="text-p4 text-txt-secondary">
            Write a better description for this section
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            disabled={!data?.pagination.has_previous_page}
            onClick={handlePrev}
            size={"icon"}
            variant={"outline"}
            className="rounded-full"
          >
            <ChevronLeft size={18} className="!w-[18px] !h-[18px]" />
          </Button>
          <Button
            // disabled={data ? data.data.Data.length < 4 : true}
            disabled={!data?.pagination.has_next_page}
            onClick={handleNext}
            size={"icon"}
            variant={"outline"}
            className="rounded-full"
          >
            <ChevronRight size={18} className="!w-[18px] !h-[18px]" />
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-auto w-full pb-2">
        {isPending ? (
          <>
            <Skeleton className="h-[144px] min-w-[250px] rounded-xl" />
            <Skeleton className="h-[144px] min-w-[250px] rounded-xl" />
            <Skeleton className="h-[144px] min-w-[250px] rounded-xl" />
            <Skeleton className="h-[144px] min-w-[250px] rounded-xl" />
          </>
        ) : (
          data?.Data.map((item) => (
            <MutualFundCard
              key={item.fundCode}
              title={item.fundName}
              riskProfile={item.riskProfile}
              estimatedYield={item.yield}
              id={item.fundCode}
            />
          ))
        )}
      </div>
    </section>
  );
};
