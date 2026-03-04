/*
=================================
SIGNUP SERVICE
- File: src/requests/services/auth/signup.ts
- Description: Service to handle user signup requests using axios and react-query.
=================================
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { signupRequestBody, signupResponse } from "@/types/auth";

/**
 * Signup service
 * @param data -  An object containing the signup information
 * @returns axios promise
 */
export const signupService = async (
  data: signupRequestBody
): Promise<signupResponse> => {
  try {
    const response = await axios.post<signupResponse>(
      "/api/auth/sign-up",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for signup request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for signup
 */
export const useSignup = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: signupResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: signupService,
    onSuccess,
    onError,
    mutationKey: ["signUp"],
  });
};
