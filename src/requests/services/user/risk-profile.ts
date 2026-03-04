import useUserStore from "@/store/user";
import { FetchRiskProfileResponse } from "@/types/risk-profile";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

/**
 * Fetch risk profile service
 * @returns axios promise
 */
export const fetchRiskProfileService =
  async (): Promise<FetchRiskProfileResponse> => {
    try {
      const response = await axios.get("/api/user/risk-profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching risk profile:", error);
      throw error;
    }
  };

/**
 * Hook for fetching and caching risk profile
 * @returns Query result with fact sheet data
 */
export const useFetchRiskProfile = (
  options?: Partial<UseQueryOptions<FetchRiskProfileResponse, Error>>
) => {
  const { setRiskProfile } = useUserStore();

  const query = useQuery({
    queryKey: ["fetch-risk-rofile"],
    queryFn: fetchRiskProfileService,
    ...options,
  });

  useEffect(() => {
    if (query.data && query.data.status === "success") {
      const data = query.data.data;
      setRiskProfile({
        risk_category: data.risk_category,
        risk_answers: data.risk_answers,
      });
    }
  }, [query.data]);

  return query;
};
