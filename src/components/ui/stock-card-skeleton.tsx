import { cn } from "@/lib/utils";

interface StockCardSkeletonProps {
  className?: string;
}

export const StockCardSkeleton = ({ className }: StockCardSkeletonProps) => {
  return (
    <div
      className={cn(
        "min-w-[136px] p-4 bg-white shadow-sm border-0.5 border-[#EEEFF1] rounded-[16px] animate-pulse",
        className
      )}
    >
      <div>
        <div className="bg-gray-200 w-[40px] h-[40px] rounded-full mb-3"></div>
        <div>
          <div className="bg-gray-200 h-4 w-full mb-1 rounded"></div>
          <div className="bg-gray-200 h-3 w-16 mb-3 rounded"></div>
        </div>
      </div>
      <div>
        <div className="bg-gray-200 h-4 w-20 mb-1 rounded"></div>
        <div className="bg-gray-200 h-3 w-12 rounded"></div>
      </div>
    </div>
  );
};