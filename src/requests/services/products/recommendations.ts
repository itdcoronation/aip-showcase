import {
  ProductFundDetails,
  ProductRecommendationsResponse,
} from "@/types/product-recs";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

/**
 * Product recommendations service
 * @returns axios promise
 */
export const fetchRecommendationsService = async (): Promise<
  Array<ProductFundDetails>
> => {
  try {
    const response = await axios.get<ProductRecommendationsResponse>(
      "/api/products/recommendations"
    );
    return response.data.data.fund_details;
  } catch (error) {
    console.error("Error fetching product recommendations", error);
    throw error;
  }
};

/**
 * Hook for fetching and caching product recommendations
 * @returns Query result with product recommendations data
 */
export const useFetchRecommendations = (
  options?: Partial<UseQueryOptions<Array<ProductFundDetails>, Error>>
) => {
  const query = useQuery({
    queryKey: ["fetch-product-recommendations"],
    queryFn: fetchRecommendationsService,
    ...options,
  });
  return query;
};
