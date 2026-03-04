/*
=================================
Initiate onboarding SERVICE
- File: src/requests/services/onboarding/initiate.ts
- Description: Service to handle initiate onboarding request and setting up the customer staging.
=================================
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  initiateOnboardingRequestBody,
  initiateOnboardingResponse,
} from "@/types/onboarding";
import useOnboardingStore from "@/store/onboarding";
import useUserStore from "@/store/user";

/**
 * initiate onboarding service
 * @param data -  An object containing the initiate onboarding information
 * @returns axios promise
 */
export const initiateOnboardingService = async (
  data: initiateOnboardingRequestBody
): Promise<initiateOnboardingResponse> => {
  try {
    const response = await axios.post<initiateOnboardingResponse>(
      "/api/onboarding/initiate",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error during initiate onboarding:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for initiate onboarding request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for initiate onboarding
 */
export const useFetchOnboardingStatus = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: initiateOnboardingResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  const { setStagingID } = useUserStore();
  const {
    setIsOnboarded,
    setCompletionPercentage,
    setOnboardingStatus,
    updateCompletionStatus,
  } = useOnboardingStore();

  const handleSuccess = (data: initiateOnboardingResponse) => {
    const { personal_info, bank_info, next_of_kin, kyc, risk_profile } =
      data.data.completion_status;
    updateCompletionStatus({
      personal_info,
      bank_info,
      next_of_kin,
      kyc,
      risk_profile,
    });
    setStagingID(data.data.staging_id);
    setOnboardingStatus(data.data.completion_status.status);
    setCompletionPercentage(data.data.completion_status.completion_percentage);
    setIsOnboarded(data.data.completion_status.status === "approved");
    onSuccess?.(data);
  };
  return useMutation({
    mutationFn: initiateOnboardingService,
    onSuccess: handleSuccess,
    onError,
    mutationKey: ["create-or-fetch-onboarding-status"],
    retry: 1,
  });
};

export const useGetOnboardingSteps = (email?: string) => {
  const { mutate } = useFetchOnboardingStatus({});

  const handleRefetch = () => {
    const { basic_info } = useUserStore.getState();
    if (basic_info.email || email) {
      mutate({ user_id: email ?? basic_info.email });
    }
  };

  return {
    refetch: handleRefetch,
  };
};
