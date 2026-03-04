/*
  Change password service and hook
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  ChangePasswordRequestBody,
  ChangePasswordResponse,
} from "@/types/user";

/**
 * Change password service
 * @param data -  An object containing the change password
 * @returns axios promise
 */
export const changePasswordService = async (
  data: ChangePasswordRequestBody
): Promise<ChangePasswordResponse> => {
  try {
    const response = await axios.post<ChangePasswordResponse>(
      "/api/user/change-password",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error during change password:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for change password request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object
 */
export const useChangePassword = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: ChangePasswordResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: changePasswordService,
    onSuccess,
    onError,
    mutationKey: ["change-password"],
  });
};
