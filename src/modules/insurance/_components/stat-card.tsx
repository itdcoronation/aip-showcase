import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EyeClosed, EyeIcon } from "lucide-react";
import useBalanceStore from "@/store/balance";
import { ArrowElbowRightIcon } from "@/assets/vectors/icons";

interface StatCardProps {
  label: string;
  value: string | number;
  isLoading?: boolean;
  trend?: number;
  ctas?: ReactNode;

  // styling
  className?: string;
  valueClassName?: string;

  // behavior
  hideable?: boolean;
}

export const StatCard = ({
  label,
  value,
  isLoading,
  trend,
  ctas,
  hideable = false,
  className = "bg-bg-secondary",
  valueClassName = "text-[var(--purple-700)]",
}: StatCardProps) => {
  const { hideBalance, setHideBalance } = useBalanceStore();

  const isHidden = hideable && hideBalance;

  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl border border-0.5 border-[#EEEFF1] shadow-xs ${className}`}
    >
      <div className="grid gap-3">
        <div className="flex justify-between items-center gap-4">
          <p className="text-p4 text-txt-secondary">{label}</p>

          {hideable &&
            (!isHidden ? (
              <EyeIcon role="button" onClick={() => setHideBalance(true)} />
            ) : (
              <EyeClosed role="button" onClick={() => setHideBalance(false)} />
            ))}
        </div>

        {!isLoading ? (
          <p className={`text-h1 sm:text-d2 font-semibold ${valueClassName}`}>
            {isHidden ? "******" : value}
          </p>
        ) : (
          <Skeleton className="w-60 h-12" />
        )}

        {trend !== undefined && (
          <span className="bg-bg-tertiary text-p3 flex gap-1.5 items-center px-1.5 py-0.5 w-fit rounded-[6px]">
            <ArrowElbowRightIcon /> {trend}%
          </span>
        )}

        {ctas}
      </div>
    </div>
  );
};
