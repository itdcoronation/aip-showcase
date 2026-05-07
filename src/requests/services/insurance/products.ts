import useInsuranceStore from "@/store/insurance";
import { InsuranceProductsResponse } from "@/types/insurance";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

export const fetchInsuranceProductsService =
  async (): Promise<InsuranceProductsResponse> => {
    try {
      const response = await axios.get<InsuranceProductsResponse>(
        "/api/insurance/products",
      );

      useInsuranceStore.getState().setProducts(response.data.data);

      return response.data;
    } catch (error) {
      console.error("Error fetching insurance products:", error);
      throw error;
    }
  };

export const useFetchInsuranceProducts = (
  options?: Partial<UseQueryOptions<InsuranceProductsResponse, Error>>,
) => {
  const query = useQuery({
    queryKey: ["fetch-insurance-products"],
    queryFn: fetchInsuranceProductsService,
    ...options,
  });

  return query;
};
