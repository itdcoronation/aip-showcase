/*
  Onboarding kyc service and hook
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { KYCResponse } from "@/types/onboarding";

/**
 * Onboarding kyc service
 * @param data -  An object containing the kyc info
 * @returns axios promise
 */
export const kycService = async (
  data: FormData,
  id: string
): Promise<KYCResponse> => {
  try {
    const response = await axios.post<KYCResponse>("/api/onboarding/kyc", data, {
      params: { id },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during onboarding - kyc:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for initiate onboarding kyc request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for initiate onboarding
 */
export const useSubmitKYC = ({
  id,
  onSuccess,
  onError,
}: {
  id: string;
  onSuccess: (data: KYCResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: (data: FormData) => kycService(data, id),
    onSuccess,
    onError,
    mutationKey: ["submit-kyc", id],
  });
};
