/*
=================================
EMAIL VERIFICATION SERVICE
=================================
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { verifyEmailRequestBody, verifyEmailResponse } from "@/types/auth";

/**
 * Email verification service
 * @param data -  An object containing the Email verification information
 * @returns axios promise
 */
export const emailVerificationService = async (
  data: verifyEmailRequestBody
): Promise<verifyEmailResponse> => {
  try {
    const response = await axios.post<verifyEmailResponse>(
      "/api/auth/verify-email",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error during email verification:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for Email verification request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for Email verification
 */
export const useVerifyEmail = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: verifyEmailResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: emailVerificationService,
    onSuccess,
    onError,
    mutationKey: ["verify-email"],
  });
};
