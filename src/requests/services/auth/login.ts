/*
=================================
LOGIN SERVICE
- File: src/requests/services/auth/login.ts
- Description: Service to handle user login requests using axios and react-query.
=================================
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  loginRequestBody,
  loginResponse,
  loginResponseData,
} from "@/types/auth";
import Cookies from "js-cookie";

/**
 * Login service
 * @param data -  An object containing the login information including email, password
 * @returns axios promise
 */
export const loginService = async (
  data: loginRequestBody
): Promise<loginResponseData> => {
  try {
    const response = await axios.post<loginResponse>("/api/auth/sign-in", data);
    // Set tokens in secure, sameSite cookies
    Cookies.set("access_token", response.data.data.token, {
      secure: true,
      sameSite: "Strict",
    });
    Cookies.set("refresh_token", response.data.data.refresh_token, {
      secure: true,
      sameSite: "Strict",
    });
    return response.data.data;
  } catch (error) {
    console.error("Error during email login:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for login request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for login
 */
export const useLogin = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: loginResponseData) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: loginService,
    onSuccess,
    onError,
    mutationKey: ["signIn"],
  });
};
