/*
=================================
FORGOT PASSWORD SERVICE
- File: src/requests/services/auth/forgot-password.ts
- Description: Service to handle user forgot password requests using axios and react-query.
=================================
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { forgotPasswordRequestBody, forgotPasswordResponse } from "@/types/auth";

/**
 * Forgot password service
 * @param data -  An object containing the Forgot password information
 * @returns axios promise
 */
export const forgotPasswordService = async (
  data: forgotPasswordRequestBody
): Promise<forgotPasswordResponse> => {
  try {
    const response = await axios.post<forgotPasswordResponse>(
      "/api/auth/forgot-password",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error during forgot password:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for Forgot password request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for Forgot password
 */
export const useForgotPassword = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: forgotPasswordResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: forgotPasswordService,
    onSuccess,
    onError,
    mutationKey: ["forgotPassword"],
  });
};
