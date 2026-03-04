/*
  Onboarding next of kin service and hook
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  NextOfKinRequestBody,
  NextOfKinResponse,
} from "@/types/onboarding";

/**
 * Onboarding next of kin service
 * @param data -  An object containing the next of kin info
 * @returns axios promise
 */
export const nextOfKinService = async (
  data: NextOfKinRequestBody,
  id: string
): Promise<NextOfKinResponse> => {
  try {
    const response = await axios.put<NextOfKinResponse>(
      "/api/onboarding/next-of-kin",
      data,
      {
        params: { id },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error during onboarding - next of kin:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for initiate onboarding next of kin request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for initiate onboarding
 */
export const useSubmitNextOfKin = ({
  id,
  onSuccess,
  onError,
}: {
  id: string;
  onSuccess: (data: NextOfKinResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: (data: NextOfKinRequestBody) =>
      nextOfKinService(data, id),
    onSuccess,
    onError,
    mutationKey: ["next-of-kin", id],
  });
};
