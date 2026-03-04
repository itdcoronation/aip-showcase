import { PortfolioBalanceResponse, PortfolioFullResponse } from "@/types/portfolio";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

/**
 * Fetch portfolio balance service
 * @returns axios promise
 */
export const fetchPortfolioBalanceService =
  async (): Promise<PortfolioBalanceResponse> => {
    try {
      const response = await axios.get("/api/portfolio/balance");
      return response.data;
    } catch (error) {
      console.error("Error fetching portfolio balance:", error);
      throw error;
    }
  };

/**
 * Fetch full portfolio service
 * @returns axios promise
 */
export const fetchPortfolioFullService =
  async (): Promise<PortfolioFullResponse> => {
    try {
      const response = await axios.get("/api/portfolio/full");
      return response.data;
    } catch (error) {
      console.error("Error fetching full portfolio:", error);
      throw error;
    }
  };

/**
 * Hook for fetching and caching portfolio balance
 * @returns Query result with portfolio balance data
 */
export const useFetchPortfolioBalance = (
  options?: Partial<UseQueryOptions<PortfolioBalanceResponse, Error>>
) => {
  const query = useQuery({
    queryKey: ["fetch-portfolio-balance"],
    queryFn: fetchPortfolioBalanceService,
    ...options,
  });

  return query;
};

/**
 * Hook for fetching and caching full portfolio data
 * @returns Query result with full portfolio data
 */
export const useFetchPortfolioFull = (
  options?: Partial<UseQueryOptions<PortfolioFullResponse, Error>>
) => {
  const query = useQuery({
    queryKey: ["fetch-portfolio-full"],
    queryFn: fetchPortfolioFullService,
    ...options,
  });

  return query;
};