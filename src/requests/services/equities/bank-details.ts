import { BankDetailsResponse } from "@/types/bank-info";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

/**
 * Bank details service for equities brokerage account
 * @returns axios promise
 */
export const fetchEquitiesBankDetailsService =
  async (): Promise<BankDetailsResponse> => {
    try {
      const response = await axios.get<BankDetailsResponse>(
        "/api/equities/bank-details"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching equities bank details:", error);
      throw error;
    }
  };

/**
 * Hook for fetching and caching equities bank details
 * @returns Query result with bank details data
 */
export const useFetchEquitiesBankDetails = (
  options?: Partial<UseQueryOptions<BankDetailsResponse, Error>>
) => {
  const query = useQuery({
    queryKey: ["fetch-equities-bank-details"],
    queryFn: fetchEquitiesBankDetailsService,
    ...options,
  });

  return query;
};
