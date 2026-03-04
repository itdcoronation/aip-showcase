import { FetchStatesResponse } from "@/types/states";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

interface fetchStatesParams {
  page: number;
  search?: string;
  per_page?: number;
}

/**
 * Retrieve states service
 * @returns axios promise
 */
export const statesService = async (
  params: fetchStatesParams
): Promise<FetchStatesResponse> => {
  try {
    const response = await axios.get<FetchStatesResponse>("/api/utils/states", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching states:", error);
    throw error;
  }
};

/**
 * Hook for fetching and caching states
 * @returns Query result with fact sheet data
 */
export const useFetchStates = ({
  params,
  options,
}: {
  params: fetchStatesParams;
  options?: Partial<UseQueryOptions<FetchStatesResponse, Error>>;
}) => {
  const query = useQuery({
    queryKey: ["fetch-states", params],
    queryFn: () => statesService(params),
    ...options,
  });

  return query;
};
