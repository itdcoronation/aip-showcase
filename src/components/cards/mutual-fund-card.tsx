import { mutualFundLogo } from "@/assets/images";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MutualFundCardProps {
  title: string;
  riskProfile: string;
  estimatedYield: number;
  id: string;
}

export const MutualFundCard = ({
  title,
  riskProfile,
  estimatedYield,
  id,
}: MutualFundCardProps) => {
  return (
    <Link
      href={`/mutual-funds/${id}`}
      className="shadow-sm p-4 bg-white border-0.5 border-[#EEEFF1] rounded-[24px] min-w-[250px]"
    >
      <div className="flex items-center justify-between mb-2">
        <Image src={mutualFundLogo} alt="" width={32} height={32} />
        <ChevronRight size={20} />
      </div>
      <p className="text-txt-primary font-semibold">{title}</p>
      <p className="text-l2 text-txt-secondary mb-3 text-[11px]">
        {riskProfile} Risk
      </p>

      <div className="flex items-center justify-between border-0.5 border-t border-[#EFEFF0] pt-2">
        <p className="text-[11px] text-txt-secondary">Estimated yield</p>
        <p className="text-p4 text-txt-success-dark">{estimatedYield}%</p>
      </div>
    </Link>
  );
};
