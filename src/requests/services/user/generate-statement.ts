/*
  generate statement service and hook
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  GenerateStatementRequestBody,
  GenerateStatementResponse,
} from "@/types/user";

/**
 * generate statement service
 * @param data -  An object containing the generate statement
 * @returns axios promise
 */
export const generateStatementService = async (
  data: GenerateStatementRequestBody
): Promise<GenerateStatementResponse> => {
  try {
    const response = await axios.post<GenerateStatementResponse>(
      "/api/user/generate-statement",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error during generate statement:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for generate statement request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object
 */
export const useGenerateStatement = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: GenerateStatementResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: generateStatementService,
    onSuccess,
    onError,
    mutationKey: ["generate-statement"],
  });
};
