/*
  Onboarding risk profile service and hook
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  RiskProfileRequestBody,
  RiskProfileResponse,
} from "@/types/onboarding";

/**
 * Onboarding risk profile service
 * @param data -  An object containing the risk profile info
 * @returns axios promise
 */
export const riskProfileService = async (
  data: RiskProfileRequestBody
): Promise<RiskProfileResponse> => {
  try {
    const response = await axios.post<RiskProfileResponse>(
      "/api/onboarding/risk-profile",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error during onboarding - risk profile:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for initiate onboarding risk profile request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for initiate onboarding
 */
export const useSubmitRiskProfile = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: RiskProfileResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: riskProfileService,
    onSuccess,
    onError,
    mutationKey: ["submit-risk-profile"],
  });
};
