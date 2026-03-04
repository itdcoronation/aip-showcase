/*
  Bank name inquiry service and hook
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { NameInquiryRequestBody, NameInquiryResponse } from "@/types/banks";

/**
 * Bank name inquiry service
 * @param data -  An object containing the name inquiry information
 * @returns axios promise
 */
export const nameInquiryService = async (
  data: NameInquiryRequestBody
): Promise<NameInquiryResponse> => {
  try {
    const response = await axios.post<NameInquiryResponse>(
      "/api/utils/bank-name-inquiry",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error during bank name inquiry:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for initiate Bank name inquiry request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for initiate onboarding
 */
export const useNameInquiry = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: NameInquiryResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: nameInquiryService,
    onSuccess,
    onError,
    mutationKey: ["bank-name-inquiry"],
  });
};
