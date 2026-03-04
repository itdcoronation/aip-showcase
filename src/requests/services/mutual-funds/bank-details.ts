import { BankDetailsResponse } from "@/types/bank-info";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

interface FetchBankDetailsParams {
  productId: string;
}

/**
 * Bank details service for investment accounts
 * @returns axios promise
 */
export const fetchBankDetailsService = async (
  params: FetchBankDetailsParams
): Promise<BankDetailsResponse> => {
  try {
    console.log('Fetching bank details for productId:', params.productId);
    const response = await axios.get<BankDetailsResponse>(
      `/api/mutual-funds/invest/bank-details?productId=${params.productId}`
    );
    console.log('Bank details response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching bank details:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

/**
 * Hook for fetching and caching investment account bank details
 * @param params - Parameters including productId
 * @param options - React Query options
 * @returns Query result with bank details data
 */
export const useFetchBankDetails = (
  params: FetchBankDetailsParams,
  options?: Partial<UseQueryOptions<BankDetailsResponse, Error>>
) => {
  const query = useQuery({
    queryKey: ["fetch-bank-details", params.productId],
    queryFn: () => fetchBankDetailsService(params),
    enabled: !!params.productId, // Only run if productId is provided
    ...options,
  });

  return query;
};