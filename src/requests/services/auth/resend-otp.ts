/*
=================================
RESEND OTP SERVICE
=================================
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { resendOtpRequestBody, resendOtpResponse } from "@/types/auth";

/**
 * Resend verification OTP service
 * @param data -  An object containing the Resend verification OTP information
 * @returns axios promise
 */
export const resendOTPService = async (
  data: resendOtpRequestBody
): Promise<resendOtpResponse> => {
  try {
    const response = await axios.post<resendOtpResponse>(
      "/api/auth/resend-otp",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error during Resend verification OTP:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for Resend verification OTP request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for Resend verification OTP
 */
export const useResendOTP = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: resendOtpResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: resendOTPService,
    onSuccess,
    onError,
    mutationKey: ["resend-otp"],
  });
};
