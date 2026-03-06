"use client";
import { MutualFundCard } from "@/components/cards/mutual-fund-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { showcaseMutualFundCards } from "../showcase-data";

export const MutualFunds = () => {
  const [page, setPage] = useState(1);
  const perPage = 4;
  const totalPages = Math.max(1, Math.ceil(showcaseMutualFundCards.length / perPage));
  const start = (page - 1) * perPage;
  const pagedData = showcaseMutualFundCards.slice(start, start + perPage);

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
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
            Diversify your portfolio with our curated selection of mutual funds
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            disabled={page <= 1}
            onClick={handlePrev}
            size={"icon"}
            variant={"outline"}
            className="rounded-full"
          >
            <ChevronLeft size={18} className="!w-[18px] !h-[18px]" />
          </Button>
          <Button
            disabled={page >= totalPages}
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
        {pagedData.map((item) => (
          <MutualFundCard
            key={item.id}
            title={item.title}
            riskProfile={item.riskProfile}
            estimatedYield={item.estimatedYield}
            id={item.id}
          />
        ))}
      </div>
    </section>
  );
};
