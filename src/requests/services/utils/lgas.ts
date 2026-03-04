import { FetchLGAsResponse } from "@/types/lgas";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

interface fetchLGAsParams {
  state_code?: string;
}

/**
 * Retrieve lgas service
 * @returns axios promise
 */
export const lgasService = async ({
  state_code,
}: fetchLGAsParams): Promise<FetchLGAsResponse> => {
  try {
    const response = await axios.get("/api/utils/lgas", {
      params: { state_code },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching lgas:", error);
    throw error;
  }
};

/**
 * Hook for fetching and caching lgas
 * @returns Query result with lgas data
 */
export const useFetchLGAs = ({
  params,
  options,
}: {
  params: fetchLGAsParams;
  options?: Partial<UseQueryOptions<FetchLGAsResponse, Error>>;
}) => {
  const query = useQuery({
    queryKey: ["fetch-lgas", params],
    queryFn: () => lgasService(params),
    ...options,
  });

  return query;
};
