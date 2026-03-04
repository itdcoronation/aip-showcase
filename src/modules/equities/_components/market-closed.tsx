import { MarketClosedSvg } from "@/assets/vectors";
import { WarningOctagonIcon } from "@/assets/vectors/icons";

interface MarketClosedBannerDto {
  addBreak?: boolean;
}

export const MarketClosedBanner = ({ addBreak }: MarketClosedBannerDto) => {
  return (
    <div className="bg-[#FFF3E6] border border-[#FFD8D0] flex items-start rounded-[12px] px-0 py-2 sm:p-2 gap-2">
      <WarningOctagonIcon className="min-w-[20px] ml-2 sm:ml-0" />
      <div className="">
        <p className="text-[#592E00] text-p3 sm:text-p2 font-semibold mb-0.5">
          Market closed
        </p>
        <p className="text-[#733A00] text-p4">
          The stock market is currently closed. Your pending orders will be
          fulfilled as soon as the market opens.{addBreak ? <br /> : null}{" "}
          Market opens in: 12 hours, 53 minutes, 32 Seconds
        </p>
      </div>

      <MarketClosedSvg className={addBreak ? "mr-2 ml-auto" : "mx-auto"} />
    </div>
  );
};
