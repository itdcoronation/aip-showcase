/*
=================================
RESET PASSWORD SERVICE
- File: src/requests/services/auth/reset-password.ts
- Description: Service to handle user reset password requests using axios and react-query.
=================================
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { resetPasswordRequestBody, resetPasswordResponse } from "@/types/auth";

/**
 * Reset password service
 * @param data -  An object containing the reset password information includinG
 * @returns axios promise
 */
export const resetPasswordService = async (
  data: resetPasswordRequestBody
): Promise<resetPasswordResponse> => {
  try {
    const response = await axios.post<resetPasswordResponse>(
      "/api/auth/reset-password",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error during reset password:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for reset password request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for reset password
 */
export const useResetPassword = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: resetPasswordResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: resetPasswordService,
    onSuccess,
    onError,
    mutationKey: ["resetPassword"],
  });
};
