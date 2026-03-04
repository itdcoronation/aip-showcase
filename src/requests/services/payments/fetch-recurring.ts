import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { RecurringPaymentsResponse } from "@/types/recurring-payment";

export const fetchRecurringPaymentsService = async (): Promise<RecurringPaymentsResponse> => {
  try {
    const response = await axios.get<RecurringPaymentsResponse>(
      "/api/payments/recurring?status=scheduled"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recurring payments:", error);
    throw error;
  }
};

export const useFetchRecurringPayments = (
  options?: Partial<UseQueryOptions<RecurringPaymentsResponse, Error>>
) => {
  return useQuery({
    queryKey: ["fetch-recurring-payments", "scheduled"],
    queryFn: fetchRecurringPaymentsService,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
