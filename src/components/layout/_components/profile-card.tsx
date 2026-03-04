"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ProfileCard = ({
  name,
  risk_category,
}: {
  name: string;
  risk_category: string;
}) => {
  return (
    <section className="flex gap-2 border border-stroke-primary p-2 bg-bg-secondary rounded-[10px] shadow-sm items-center">
      <Avatar className="w-[32px] h-[32px]">
        <AvatarImage src="" />
        <AvatarFallback className="bg-bg-tertiary text-xs">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="overflow-hidden">
        <div className="flex items-center gap-1 sm:grid sm:grid-cols-[1fr_72px] flex-wrap sm:flex-nowrap">
          <p className="text-sm sm:text-md truncate">{name}</p>{" "}
          {!!risk_category ? (
            <Tooltip>
              <TooltipTrigger>
                <span className="text-xs bg-bg-brand-light text-txt-brand p-1 rounded-[6px] truncate sm:max-w-[72px] line-clamp-1">
                  {risk_category}
                </span>
              </TooltipTrigger>
              <TooltipContent>{risk_category}</TooltipContent>
            </Tooltip>
          ) : null}
        </div>
        {/* <p className="text-sm">ID: 5463627</p> */}
      </div>
    </section>
  );
};
