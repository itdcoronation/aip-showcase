import { HistoryTradesResponse } from "@/types/equity";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

/**
 * Fetch history trades service
 * @returns axios promise
 */
export const fetchHistoryTradesService =
  async (): Promise<HistoryTradesResponse> => {
    try {
      const response = await axios.post("/api/equities/history");
      return response.data;
    } catch (error) {
      console.error("Error fetching trade history:", error);
      throw error;
    }
  };

/**
 * Hook for fetching and caching trade history
 * @returns Query result with trade history data
 */
export const useFetchHistoryTrades = (
  options?: Partial<UseQueryOptions<HistoryTradesResponse, Error>>
) => {
  const query = useQuery({
    queryKey: ["fetch-history-trades"],
    queryFn: fetchHistoryTradesService,
    ...options,
  });

  return query;
};