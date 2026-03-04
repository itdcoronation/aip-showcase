/*
  Feedback service and hook
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { FeedbackRequestBody, FeedbackResponse } from "@/types/feedback";

/**
 * feedback service
 * @param data -  An object containing the name inquiry information
 * @returns axios promise
 */
export const feedbackService = async (
  data: FeedbackRequestBody
): Promise<FeedbackResponse> => {
  try {
    const response = await axios.post<FeedbackResponse>(
      "/api/utils/feedback",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error during feedback:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for initiate feedback request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for feedback
 */
export const useSubmitFeedback = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: FeedbackResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: feedbackService,
    onSuccess,
    onError,
    mutationKey: ["feedback"],
  });
};
