"use client";

import { UserSwitchIcon } from "@/assets/vectors/icons";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface SwitchAccountProps {
  accounts: { label: string; value: string }[];
  account: string | undefined;
  setAccount: (value: string) => void;
}
export const SwitchAccount = ({
  accounts,
  account,
  setAccount,
}: SwitchAccountProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mt-4 -mb-2 rounded-[8px] border border-stroke-primary bg-white flex gap-1 items-center px-2 py-1.5 font-medium text-txt-primary text-sm w-fit mx-auto">
        Switch account <UserSwitchIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-3 py-0">
        <DropdownMenuLabel className="text-txt-secondary font-medium py-3.5 px-0">
          Accounts
        </DropdownMenuLabel>
        {accounts.map((item) => (
          <div key={item.label} className="border-t border-stroke-primary">
            <DropdownMenuItem
              onClick={() => setAccount(item.value)}
              className={cn(
                "font-medium py-2.5 px-0 !bg-transparent cursor-pointer",
                item.value === account
                  ? "text-txt-primary"
                  : "text-txt-secondary"
              )}
            >
              {item.value === account ? (
                <div className="w-4 h-4 border border-4 border-bg-brand rounded-full ml-1"></div>
              ) : (
                <div className="w-4 h-4 border border-3 border-stroke-primary rounded-full ml-1"></div>
              )}
              {item.label}
              {item.value === account ? (
                <span className="text-xs bg-bg-success-light text-txt-success px-2 py-0.5 font-medium rounded-sm ml-4">
                  Selected
                </span>
              ) : null}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
