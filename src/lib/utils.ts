import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string) => {
  const names = name.split(" ");
  const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
  return initials.slice(0, 2);
};

/**
 * Format currency values with proper symbols and commas
 * @param amount - The amount to format
 * @param currency - The currency type ('NGN' or 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: "NGN" | "USD"
): string => {
  const symbol = currency === "NGN" ? "₦" : "$";
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${symbol} ${formattedAmount}`;
};
