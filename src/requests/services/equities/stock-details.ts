import { StockDetailsResponse } from "@/types/equity";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface StockDetailsParams {
  symbol: string;
}

/**
 * Fetch stock details service
 */
export const fetchStockDetailsService = async ({ symbol }: StockDetailsParams): Promise<StockDetailsResponse> => {
  try {
    const response = await axios.post(`/api/equities/stock-details`, {
      symbol: symbol.toUpperCase(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock details:', error);
    throw error;
  }
};

/**
 * React Query hook for stock details
 */
export const useStockDetails = ({ symbol }: StockDetailsParams) => {
  return useQuery({
    queryKey: ['stock-details', symbol],
    queryFn: () => fetchStockDetailsService({ symbol }),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};