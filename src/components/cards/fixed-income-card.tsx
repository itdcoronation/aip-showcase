import { mutualFundLogo } from "@/assets/images";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const FixedIncomeCard = () => {
  return (
    <Link href="/fixed-income/123" className="shadow-sm p-4 bg-white border-0.5 border-[#EEEFF1] rounded-[24px] min-w-[250px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2 items-center">
          <Image src={mutualFundLogo} alt="" width={32} height={32} />
          <span className="text-p4 text-txt-primary p-1 bg-bg-tertiary rounded-[6px] font-semibold">
            Treasury bills
          </span>
        </div>
        <ChevronRight size={20} />
      </div>
      <p className="text-txt-primary font-semibold">USD Bonds</p>
      <p className="text-l2 text-txt-secondary mb-3 text-[11px]">
        Coronation MFB
      </p>

      <div className="flex items-center justify-between border-0.5 border-t border-[#EFEFF0] pt-2">
        <div>
          <p className="text-[11px] text-txt-secondary mb-0.5">Tenure</p>
          <p className="text-p4 text-txt-primary">168 days</p>
        </div>

        <div>
          <p className="text-[11px] text-txt-secondary mb-0.5">Coupon</p>
          <p className="text-p4 text-txt-success-dark">22.82%</p>
        </div>
      </div>
    </Link>
  );
};

export const FixedIncomeCard2 = () => {
  return (
    <Link href="/fixed-income/123" className="shadow-sm p-4 bg-white border-0.5 border-[#EEEFF1] rounded-[24px] min-w-[250px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2 items-center">
          <Image src={mutualFundLogo} alt="" width={32} height={32} />
          <div>
            <p className="text-txt-primary">
              Federal Government Treasury Bill 2025
            </p>
            <p className="text-l2 text-txt-secondary text-[11px]">
              Coronation MFB
            </p>
          </div>
        </div>
        <ChevronRight size={20} />
      </div>

      <div className="flex items-center justify-between border-0.5 border-t border-[#EFEFF0] pt-2">
        <div>
          <p className="text-[11px] text-txt-secondary mb-0.5">Rate</p>
          <p className="text-p4 text-txt-success-dark font-semibold">22.82%</p>
        </div>
        <div>
          <p className="text-[11px] text-txt-secondary mb-0.5">Tenure</p>
          <p className="text-p4 text-txt-primary">168 days</p>
        </div>
      </div>
    </Link>
  );
};
