/**
 * Payment utility functions for card payment integration
 */

/**
 * Transforms UI frequency values to API frequency values
 * @param frequency - The frequency from the UI ("Daily", "Monthly", "Annually")
 * @returns API frequency value ("DAILY", "MONTHLY", "YEARLY")
 */
export const transformFrequency = (frequency: string): 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' => {
  const frequencyMap: Record<string, 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'> = {
    'Daily': 'DAILY',
    'Weekly': 'WEEKLY',
    'Monthly': 'MONTHLY',
    'Annually': 'YEARLY',
  };
  
  return frequencyMap[frequency] || 'MONTHLY';
};

/**
 * Formats a Date object to YYYY-MM-DD format for API
 * @param date - The date to format
 * @returns Formatted date string (YYYY-MM-DD)
 */
export const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Cleans and converts amount string to number
 * @param amount - The amount string with possible commas
 * @returns Numeric amount
 */
export const cleanAmount = (amount: string): number => {
  return Number(amount.replace(/,/g, ''));
};
