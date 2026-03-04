import useOnboardingStore from "@/store/onboarding";
import { RetrieveOnboardingResponse } from "@/types/onboarding";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

/**
 * Retrieve onboarding info service
 * @returns axios promise
 */
export const retrieveOnboardingService = async (
  id: string
): Promise<RetrieveOnboardingResponse> => {
  try {
    const response = await axios.get("/api/onboarding/user-data", {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching onboarding info:", error);
    throw error;
  }
};

/**
 * Hook for fetching and caching onboarding info
 * @returns Query result with fact sheet data
 */
export const useFetchOnboardingData = ({
  id,
  options,
}: {
  id: string;
  options?: Partial<UseQueryOptions<RetrieveOnboardingResponse, Error>>;
}) => {
  const { setData } = useOnboardingStore();

  const query = useQuery({
    queryKey: ["fetch-onboarding-user-data", id],
    queryFn: () => retrieveOnboardingService(id),
    ...options,
  });

  useEffect(() => {
    if (query.data && query.data.success) {
      setData(query.data.data);
    }
  }, [query.data]);

  return query;
};
