import { ArrowElbowRightIcon } from "@/assets/vectors/icons";
import { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";
import { EyeClosed, EyeIcon } from "lucide-react";
import useBalanceStore from "@/store/balance";

interface BalanceDto {
  title: string;
  ctas?: ReactNode;
  rate?: number;
  amount: string;
  isLoading?: boolean;
}
export const Balance = ({
  title,
  ctas,
  rate,
  amount,
  isLoading,
}: BalanceDto) => {
  const { hideBalance, setHideBalance } = useBalanceStore();
  return (
    <div className="grid gap-2">
      <div className="flex justify-between items-center gap-4">
        <p className="text-p4 text-txt-secondary">{title}</p>
        {!hideBalance ? (
          <EyeIcon role="button" onClick={() => setHideBalance(!hideBalance)} />
        ) : (
          <EyeClosed
            role="button"
            onClick={() => setHideBalance(!hideBalance)}
          />
        )}
      </div>
      {!isLoading ? (
        <p className="text-h1 sm:text-d2 text-[var(--purple-700)] font-semibold">
          {hideBalance ? "******" : amount}
        </p>
      ) : (
        <Skeleton className="w-[240px] h-12" />
      )}
      {rate === undefined ? null : (
        <span className="bg-bg-tertiary text-p3 flex gap-1.5 items-center px-1.5 py-[2px] w-fit rounded-[6px]">
          <ArrowElbowRightIcon /> {rate}%
        </span>
      )}
      {ctas}
    </div>
  );
};
