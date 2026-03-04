/*
=================================
REFRESH TOKEN SERVICE
- File: src/requests/services/auth/refresh-token.ts
- Description: Service to handle user refresh token requests using axios and react-query.
=================================
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  refreshTokenRequestBody,
  refreshTokenResponse,
  refreshTokenResponseData,
} from "@/types/auth";
import Cookies from "js-cookie";

/**
 * Refresh token service
 * @param data -  An object containing the refresh token information
 * @returns axios promise
 */
export const refreshTokenService = async (
  data: refreshTokenRequestBody
): Promise<refreshTokenResponseData> => {
  try {
    const response = await axios.post<refreshTokenResponse>(
      "/api/auth/refresh",
      data
    );

    const expires_in = response.data.data.expires_in; // Example: 800 seconds (13 minutes and 20 seconds)
    const expirationDate = new Date(new Date().getTime() + expires_in * 1000);

    // Set tokens in secure, sameSite cookies
    Cookies.set("access_token", response.data.data.token, {
      secure: true,
      sameSite: "Strict",
      expires: expirationDate,
    });
    Cookies.set("refresh_token", response.data.data.refresh_token, {
      secure: true,
      sameSite: "Strict",
    });
    return response.data.data;
  } catch (error) {
    console.error("Error during refresh token:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for refresh token request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for refresh token
 */
export const useRefreshToken = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: refreshTokenResponseData) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: refreshTokenService,
    onSuccess,
    onError,
    mutationKey: ["refreshToken"],
  });
};
