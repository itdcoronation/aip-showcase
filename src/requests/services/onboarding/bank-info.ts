/*
  Onboarding bank info service and hook
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { BankInfoRequestBody, BankInfoResponse } from "@/types/onboarding";

/**
 * Onboarding bank info service
 * @param data -  An object containing the bank info
 * @returns axios promise
 */
export const bankInfoService = async (
  data: BankInfoRequestBody,
  id: string
): Promise<BankInfoResponse> => {
  try {
    const response = await axios.put<BankInfoResponse>(
      "/api/onboarding/bank-info",
      data,
      {
        params: { id },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error during onboarding - bank info:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for initiate onboarding bank info request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for initiate onboarding
 */
export const useSubmitBankInfo = ({
  id,
  onSuccess,
  onError,
}: {
  id: string;
  onSuccess: (data: BankInfoResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: (data: BankInfoRequestBody) => bankInfoService(data, id),
    onSuccess,
    onError,
    mutationKey: ["bank-info", id],
  });
};
