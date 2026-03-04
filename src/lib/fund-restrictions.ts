/**
 * Fund-specific feature blocking service
 * Used to restrict certain features for specific funds
 */

export interface FundRestriction {
  fundCode: string;
  restrictedFeatures: string[];
  messages: {
    [feature: string]: string;
  };
}

// Define fund restrictions configuration
const FUND_RESTRICTIONS: FundRestriction[] = [
  {
    fundCode: "CFIDFUND",
    restrictedFeatures: ["redeem"],
    messages: {
      redeem: "Digital Redemption is not available for  {FundName}"
    }
  }
  // Add more fund restrictions as needed
];

/**
 * Check if a specific feature is blocked for a fund
 * @param fundCode - The fund code to check
 * @param feature - The feature to check (e.g., "redeem", "purchase")
 * @returns Object with isBlocked boolean and message if blocked
 */
export const checkFundFeatureRestriction = (
  fundCode: string,
  feature: string
): { isBlocked: boolean; message?: string; fundName?: string } => {
  const restriction = FUND_RESTRICTIONS.find(
    (r) => r.fundCode.toLowerCase() === fundCode.toLowerCase()
  );

  if (!restriction || !restriction.restrictedFeatures.includes(feature)) {
    return { isBlocked: false };
  }

  return {
    isBlocked: true,
    message: restriction.messages[feature] || `This feature is not available for this fund`
  };
};

/**
 * Get restriction message with fund name interpolated
 * @param fundCode - The fund code
 * @param feature - The feature being checked
 * @param fundName - The display name of the fund
 * @returns Formatted message or null if no restriction
 */
export const getFundRestrictionMessage = (
  fundCode: string,
  feature: string,
  fundName?: string
): string | null => {
  const restriction = checkFundFeatureRestriction(fundCode, feature);
  
  if (!restriction.isBlocked || !restriction.message) {
    return null;
  }

  // Replace {FundName} placeholder with actual fund name
  return restriction.message.replace(
    /\{FundName\}/g,
    fundName || fundCode
  );
};

/**
 * Check if redeem is available for a specific fund
 * @param fundCode - The fund code to check
 * @param fundName - Optional fund display name
 * @returns Object with availability status and message
 */
export const checkRedeemAvailability = (
  fundCode: string,
  fundName?: string
): { isAvailable: boolean; message?: string } => {
  const restriction = checkFundFeatureRestriction(fundCode, "redeem");
  
  if (!restriction.isBlocked) {
    return { isAvailable: true };
  }

  return {
    isAvailable: false,
    message: getFundRestrictionMessage(fundCode, "redeem", fundName) || undefined
  };
};