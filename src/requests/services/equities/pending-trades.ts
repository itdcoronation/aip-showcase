import { PendingTradesResponse } from "@/types/equity";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

/**
 * Fetch pending trades service
 * @returns axios promise
 */
export const fetchPendingTradesService =
  async (): Promise<PendingTradesResponse> => {
    try {
      const response = await axios.post("/api/equities/pending");
      return response.data;
    } catch (error) {
      console.error("Error fetching pending trades:", error);
      throw error;
    }
  };

/**
 * Hook for fetching and caching pending trades
 * @returns Query result with pending trades data
 */
export const useFetchPendingTrades = (
  options?: Partial<UseQueryOptions<PendingTradesResponse, Error>>
) => {
  const query = useQuery({
    queryKey: ["fetch-pending-trades"],
    queryFn: fetchPendingTradesService,
    ...options,
  });

  return query;
};