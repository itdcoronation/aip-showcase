/*
  Fund redeem service and hook
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export interface RedeemRequestBody {
  fundCode: string;
  amount: number;
  narration: string;
  reference: string;
}

export interface RedeemResponseData {
  reference: string;
  statusID: number;
  statusText: string;
  statusMessage: string;
  outValue: string;
  serviceDown: boolean;
}

export interface RedeemResponse {
  Status: boolean;
  Code: string;
  Message: string;
  user_id: string;
  Data: RedeemResponseData;
  redemption_details: {
    reference: string;
    fundCode: string;
    amount: number;
    narration: string;
  };
  timestamp: string;
}

/**
 * Generate unique 19-character reference starting with AIP-
 */
export const generateRedeemReference = (): string => {
  const timestamp = Date.now().toString();
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AIP-${timestamp.slice(-6)}${randomSuffix}`;
};

/**
 * Fund redeem service
 * @param data - An object containing the redeem information
 * @returns axios promise
 */
export const redeemService = async (
  data: RedeemRequestBody
): Promise<RedeemResponse> => {
  try {
    const response = await axios.post<RedeemResponse>(
      "/api/mutual-funds/redeem",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error during fund redemption:", error);
    return Promise.reject(error);
  }
};

/**
 * Hook for fund redeem request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for redeem
 */
export const useRedeemFund = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: RedeemResponse) => void;
  onError?: (error: AxiosError) => void;
}) => {
  return useMutation({
    mutationFn: redeemService,
    onSuccess,
    onError,
  });
};