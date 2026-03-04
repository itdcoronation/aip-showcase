import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  CancelRecurringPaymentRequest,
  CancelRecurringPaymentResponse,
} from "@/types/recurring-payment";

export const cancelRecurringPaymentService = async (
  data: CancelRecurringPaymentRequest
): Promise<CancelRecurringPaymentResponse> => {
  try {
    const response = await axios.post<CancelRecurringPaymentResponse>(
      "/api/payments/recurring/cancel",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error canceling recurring payment:", error);
    return Promise.reject(error);
  }
};

export const useCancelRecurringPayment = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: CancelRecurringPaymentResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: cancelRecurringPaymentService,
    onSuccess,
    onError,
    mutationKey: ["cancel-recurring-payment"],
  });
};
