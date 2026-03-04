import { BrokerageBalanceResponse, TopGainersResponse } from "@/types/equity";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

/**
 * Fetch brokerage balance service
 * @returns axios promise
 */
export const fetchBrokerageBalanceService =
  async (): Promise<BrokerageBalanceResponse> => {
    try {
      const response = await axios.get("/api/equities/balance");
      return response.data;
    } catch (error) {
      console.error("Error fetching brokerage balance:", error);
      throw error;
    }
  };

/**
 * Hook for fetching and caching brokerage balance
 * @returns Query result with brokerage balance data
 */
export const useFetchBrokerageBalance = (
  options?: Partial<UseQueryOptions<BrokerageBalanceResponse, Error>>
) => {
  const query = useQuery({
    queryKey: ["fetch-brokerage-balance"],
    queryFn: fetchBrokerageBalanceService,
    ...options,
  });

  return query;
};

/**
 * Fetch top gainers service
 * @returns axios promise
 */
export const fetchTopGainersService =
  async (): Promise<TopGainersResponse> => {
    try {
      const response = await axios.get("/api/equities/top-gainers");
      return response.data;
    } catch (error) {
      console.error("Error fetching top gainers:", error);
      throw error;
    }
  };

/**
 * Hook for fetching and caching top gainers
 * @returns Query result with top gainers data
 */
export const useFetchTopGainers = (
  options?: Partial<UseQueryOptions<TopGainersResponse, Error>>
) => {
  const query = useQuery({
    queryKey: ["fetch-top-gainers"],
    queryFn: fetchTopGainersService,
    ...options,
  });

  return query;
};