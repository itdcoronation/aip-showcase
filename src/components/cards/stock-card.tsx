import { mutualFundLogo } from "@/assets/images";
import { ArrowElbowRightIcon } from "@/assets/vectors/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface StockCardProps {
  className?: string;
  stockCode?: string;
  name?: string;
  price?: string;
  percentChange?: string;
  iconUrl?: string | null;
}

export const StockCard = ({ 
  className, 
  stockCode = "ACCESSCORP",
  name = "Access Holdings", 
  price = "22.20",
  percentChange = "0",
  iconUrl
}: StockCardProps) => {
  const formattedPrice = Number(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedPercentChange = Number(percentChange).toFixed(2);
  const isPositive = Number(percentChange) >= 0;

  return (
    <Link
      href={`/equities/${stockCode}`}
      className={cn(
        "min-w-[136px] max-w-[136px] p-4 bg-white shadow-sm border-0.5 border-[#EEEFF1] rounded-[16px] rounded-[24px]",
        className || ""
      )}
    >
      <div>
        <div className="bg-bg-secondary w-[40px] h-[40px] rounded-full flex mb-3">
          {iconUrl ? (
            <Image
              className="m-auto rounded-full"
              src={iconUrl}
              width={26}
              height={28}
              alt={`${name} logo`}
              onError={(e) => {
                // Fallback to mutual fund logo if image fails to load
                e.currentTarget.src = mutualFundLogo.src;
              }}
            />
          ) : (
            <Image
              className="m-auto"
              src={mutualFundLogo}
              width={26}
              height={28}
              alt="Default stock logo"
            />
          )}
        </div>
        <div>
          <p className="text-txt-primary font-semibold truncate w-full max-w-[104px]" title={name}>{name}</p>
          <p className="text-l2 text-txt-secondary mb-3 text-[11px] truncate w-full max-w-[104px]" title={stockCode}>
            {stockCode}
          </p>
        </div>
      </div>
      <div>
        <p className="text-txt-primary font-bold mb-0.5">₦ {formattedPrice}</p>
        <span className={cn(
          "text-[11px] flex gap-1.5 items-center",
          isPositive ? "text-txt-success" : "text-txt-danger"
        )}>
          <ArrowElbowRightIcon /> {isPositive ? "+" : ""}{formattedPercentChange}%
        </span>
      </div>
    </Link>
  );
};
