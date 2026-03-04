// Fund minimum investment mapping utility
// Maps fund codes to their respective minimum investment amounts

const FUND_MINIMUMS: Record<string, number> = {
  CFIDFUND: 1000, // USD fund, minimum $1,000
  // Add more fund codes and their minimums here
};

/**
 * Get minimum investment amount for a fund code
 * @param fundCode - The fund code to check
 * @returns Minimum investment amount (default 5,000)
 */
export const getMinimumInvestment = (fundCode: string): number => {
  return FUND_MINIMUMS[fundCode] ?? 5000;
};
