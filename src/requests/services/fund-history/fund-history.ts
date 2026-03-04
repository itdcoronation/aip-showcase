import { FundHistoryResponse } from "@/types/fund-history";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

interface fetchFundHistoryParams {
  fundId: string;
}

/**
 * Fund history service
 * @returns axios promise
 */
export const fetchFundHistoryService = async (
  params: fetchFundHistoryParams
): Promise<FundHistoryResponse> => {
  try {
    const response = await axios.get<FundHistoryResponse>(`/api/fund-history?id=${params.fundId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching fund history:", error);
    throw error;
  }
};

/**
 * Hook for fetching and caching fund history
 * @returns Query result with fund history data
 */
export const useFetchFundHistory = ({
  params,
  options,
}: {
  params: fetchFundHistoryParams;
  options?: Partial<UseQueryOptions<FundHistoryResponse, Error>>;
}) => {
  const query = useQuery({
    queryKey: ["fund-history", params],
    queryFn: () => fetchFundHistoryService(params),
    enabled: !!params.fundId, // Only run if fundId is provided
    ...options,
  });
  return query;
};