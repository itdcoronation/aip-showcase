import useUserStore from "@/store/user";
import { BasicInformationResponse } from "@/types/user";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

/**
 * Fetch user profile service
 * @returns axios promise
 */
export const fetchProfileService =
  async (): Promise<BasicInformationResponse> => {
    try {
      const response = await axios.get("/api/user/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  };

/**
 * Hook for fetching and caching user profile
 * @returns Query result with fact sheet data
 */
export const useFetchProfile = (
  options?: Partial<UseQueryOptions<BasicInformationResponse, Error>>
) => {
  const { setBasicInfo } = useUserStore();

  const query = useQuery({
    queryKey: ["fetch-profile"],
    queryFn: fetchProfileService,
    ...options,
  });

  useEffect(() => {
    if (query.data && query.data.success) {
      const data = query.data.data.user;
      setBasicInfo({
        email: data.email,
        bvn: data.bvn,
        phone: data.phone_number,
        first_name: data.first_name,
        last_name: data.last_name,
      });
    }
  }, [query.data]);

  return query;
};
