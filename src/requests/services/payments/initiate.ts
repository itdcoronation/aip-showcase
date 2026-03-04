/*
  Payment initiation service and hook
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  InitiatePaymentRequestBody,
  InitiatePaymentResponse,
} from "@/types/payment";

/**
 * Payment initiation service
 * @param data - An object containing the payment details
 * @returns axios promise
 */
export const initiatePaymentService = async (
  data: InitiatePaymentRequestBody
): Promise<InitiatePaymentResponse> => {
  try {
    const response = await axios.post<InitiatePaymentResponse>(
      "/api/payments/initiate",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error during payment initiation:", error);
    return Promise.reject(error);
  }
};

/**
 * Hook for initiating payment request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object
 */
export const useInitiatePayment = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: InitiatePaymentResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: initiatePaymentService,
    onSuccess,
    onError,
    mutationKey: ["initiate-payment"],
  });
};
