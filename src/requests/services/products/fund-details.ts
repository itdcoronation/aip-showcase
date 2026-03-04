import { FundDetailsResponse } from "@/types/fund-details";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

interface fetchFundDetailsParams {
  fund_filter: string;
}

/**
 * Fund details service
 * @returns axios promise
 */
export const fetchFundDetailsService = async (
  params: fetchFundDetailsParams
): Promise<FundDetailsResponse> => {
  try {
    const response = await axios.get<FundDetailsResponse>("/api/products/fund-details", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching fund details:", error);
    throw error;
  }
};

/**
 * Hook for fetching and caching fund details
 * @returns Query result with fund details data
 */
export const useFetchFundDetails = ({
  params,
  options,
}: {
  params: fetchFundDetailsParams;
  options?: Partial<UseQueryOptions<FundDetailsResponse, Error>>;
}) => {
  const query = useQuery({
    queryKey: ["fund-details", params],
    queryFn: () => fetchFundDetailsService(params),
    enabled: !!params.fund_filter, // Only run if fund_filter is provided
    ...options,
  });
  return query;
};