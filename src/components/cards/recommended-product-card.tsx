import { mutualFundLogo } from "@/assets/images";
// import { ArrowElbowRightIcon } from "@/assets/vectors/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ProductRecCardProps {
  className?: string;
  name: string;
  code: string;
  link: string;
  status: string;
}

export const ProductRecCard = ({ className, name, code,status, link }: ProductRecCardProps) => {
  return (
    <Link
      href={link}
      className={cn(
        "min-w-[136px] p-4 bg-white shadow-sm border-0.5 border-[#EEEFF1] rounded-[16px] rounded-[24px] grid",
        className || ""
      )}
    >
      <div>
        <div className="bg-bg-secondary w-[40px] h-[40px] rounded-full flex mb-3">
          <Image
            className="m-auto"
            src={mutualFundLogo}
            width={40}
            height={40}
            alt="logo"
          />
        </div>
        <div>
          <p className="text-txt-primary font-semibold mb-1">{name}</p>
          <p className="text-l2 text-txt-secondary mb-3 text-[11px]">{code}</p>
        </div>
      </div>
      {/* <div>
        <p className="text-txt-primary font-bold mb-0.5">₦ 22.20</p>
        <span className="text-[11px] flex gap-1.5 items-center text-txt-success">
          <ArrowElbowRightIcon /> 0%
        </span>
      </div> */}
      <div className="mt-auto" >
        {/* <p className="text-txt-primary font-bold mb-0.5">₦ 22.20</p> */}
        <span className={cn("text-[11px] flex gap-1.5 items-center text-txt-success capitalize", status === "available" ? "text-txt-success" : "text-txt-danger" )}>
          {status}
        </span>
      </div>
    </Link>
  );
};
