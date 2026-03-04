import { WarningOctagonIcon } from "@/assets/vectors/icons";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface NoticeProps {
  title: string;
  description: ReactNode | string;
  className?: string;
}
export const Notice = ({ title, description, className }: NoticeProps) => {
  return (
    <div
      className={cn(
        "bg-[#FFF3E6] border border-[#FFD8D0] flex items-start rounded-[12px] p-2 gap-2",
        className
      )}
    >
      <WarningOctagonIcon className="min-w-[20px]" />
      <div className="">
        <p className="text-[#592E00] text-p3 sm:text-p2 font-semibold mb-0.5">{title}</p>
        <p className="text-[#733A00] text-p4">{description}</p>
      </div>
    </div>
  );
};
