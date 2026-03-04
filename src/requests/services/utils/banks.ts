import { BanksResponseData, FetchBanksResponse } from "@/types/banks";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

/**
 * Retrieve banks service
 * @returns axios promise
 */
export const banksService = async (): Promise<BanksResponseData[]> => {
  try {
    const response = await axios.get<FetchBanksResponse>("/api/utils/banks");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching banks:", error);
    throw error;
  }
};

/**
 * Hook for fetching and caching banks
 * @returns Query result with fact sheet data
 */
export const useFetchBanks = (
  options?: Partial<UseQueryOptions<BanksResponseData[], Error>>
) => {
  const query = useQuery({
    queryKey: ["fetch-banks"],
    queryFn: banksService,
    ...options,
  });

  return query;
};
