/*
  Onboarding personal info service and hook
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  PersonalInfoRequestBody,
  PersonalInfoResponse,
} from "@/types/onboarding";

/**
 * Onboarding personal info service
 * @param data -  An object containing the personal info
 * @returns axios promise
 */
export const personalInfoService = async (
  data: PersonalInfoRequestBody,
  id: string
): Promise<PersonalInfoResponse> => {
  try {
    const response = await axios.put<PersonalInfoResponse>(
      "/api/onboarding/personal-info",
      data,
      {
        params: { id },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error during onboarding - personal info:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for initiate onboarding personal info request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for initiate onboarding
 */
export const useSubmitPersonalInfo = ({
  id,
  onSuccess,
  onError,
}: {
  id: string;
  onSuccess: (data: PersonalInfoResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: (data: PersonalInfoRequestBody) =>
      personalInfoService(data, id),
    onSuccess,
    onError,
    mutationKey: ["personal-info", id],
  });
};
