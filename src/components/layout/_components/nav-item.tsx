"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface NavItemData {
  title: string;
  path?: string;
  isActive?: boolean;
  icon: ReactNode;
  type?: "link" | "button";
  onClick?: () => void;
  isComingSoon?: boolean;
}
export interface NavItemProps extends NavItemData {
  onClickCapture?: () => void;
}
export const NavItem = ({
  onClickCapture,
  title,
  path,
  icon,
  isActive = false,
  type = "link",
  onClick,
  isComingSoon,
}: NavItemProps) => {
  return type === "link" && path && !isComingSoon ? (
    <Link
      onClickCapture={onClickCapture}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-[8px] text-[14px]",
        isActive ? "bg-bg-secondary text-txt-primary" : "text-txt-tertiary"
      )}
      href={path}
    >
      {icon}
      <span>{title}</span>
    </Link>
  ) : (
    <button
      onClick={onClick}
      onClickCapture={onClickCapture}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-[8px] text-[14px] w-full",
        isActive ? "bg-bg-secondary text-txt-primary" : "text-txt-tertiary",
        "disabled:cursor-not-allowed"
      )}
      disabled={isComingSoon}
    >
      <span className={isComingSoon ? "opacity-50" : ""}>{icon}</span>
      <span className={isComingSoon ? "opacity-50" : ""}>{title}</span>
      {isComingSoon ? (
        <span className="text-xs px-1.5 py-0.5 bg-bg-tertiary rounded-sm ml-auto whitespace-nowrap text-txt-primary">
          Coming soon
        </span>
      ) : null}
    </button>
  );
};
