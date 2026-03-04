/*
  Contact us service and hook
*/

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ContactUsRequestBody, ContactUsResponse } from "@/types/contact-us";

/**
 * Contact us service
 * @param data -  An object containing the name inquiry information
 * @returns axios promise
 */
export const contactUsService = async (
  data: ContactUsRequestBody
): Promise<ContactUsResponse> => {
  try {
    const response = await axios.post<ContactUsResponse>(
      "/api/utils/contact-us",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error during contact us:", error);
    // throw error;
    return Promise.reject(error);
  }
};

/**
 * Hook for initiate contact us request
 * @param onSuccess - Callback function to handle success response
 * @param onError - Callback function to handle error response
 * @returns Mutation object for contact us
 */
export const useContactUs = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: ContactUsResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: contactUsService,
    onSuccess,
    onError,
    mutationKey: ["contact-us"],
  });
};
