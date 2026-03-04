/**
 * Currency mapping utility for fund codes
 * Maps fund codes to their respective currency symbols
 */

const USD_FUND_CODES = ['CFIDFUND', 'AEP'];

/**
 * Determines the currency symbol based on fund code
 * @param fundCode - The fund code to check
 * @returns Currency symbol (₦ for NGN, $ for USD)
 */
export const getCurrencySymbol = (fundCode: string): string => {
  // Check if fund code is in USD list or ends with "USD"
  if (USD_FUND_CODES.includes(fundCode) || fundCode.endsWith('USD')) {
    return '$';
  }
  return '₦';
};

/**
 * Formats currency value with appropriate symbol
 * @param value - The numeric value to format
 * @param fundCode - The fund code to determine currency
 * @returns Formatted currency string
 */
export const formatCurrencyByFundCode = (value: number, fundCode: string): string => {
  const symbol = getCurrencySymbol(fundCode);
  return `${symbol}${value.toLocaleString()}`;
};

/**
 * Add new USD fund codes to the mapping
 * @param newCodes - Array of fund codes to add
 */
export const addUSDFundCodes = (newCodes: string[]): void => {
  USD_FUND_CODES.push(...newCodes);
};

/**
 * Determines the currency code based on fund code for API payloads
 * @param fundCode - The fund code to check
 * @returns Currency code (NGN or USD)
 */
export const getCurrencyCode = (fundCode: string): 'NGN' | 'USD' => {
  if (USD_FUND_CODES.includes(fundCode) || fundCode.endsWith('USD')) {
    return 'USD';
  }
  return 'NGN';
};