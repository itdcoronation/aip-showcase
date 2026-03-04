import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

interface fetchFactSheetParams {
  fund_filter?: string;
  view_type?: string;
  page?: number;
  per_page?: number;
}

interface FundResponseData {
  aboutFund: string;
  accounting: string;
  assetClass: string;
  benchmark: string;
  benchmarkReturn: number;
  currency: string;
  earlyRedemptionCharge: string;
  entryCharge: string;
  exitCharge: string;
  expenseRatio: string;
  fundCode: string;
  fundLaunchDate: string;
  fundName: string;
  fundType: string;
  incomeDistribution: string;
  logic: number;
  managementFees: number;
  minimumAdditionalTransaction: string;
  minimumHoldingPeriod: string;
  minimumInitialTransaction: string;
  offerprice: number;
  outperformance: number;
  prospectus: string;
  quarter: string;
  riskProfile: string;
  trustdeed: string;
  yield: number;
  yieldType: string;
  ytdAtQuarterEnd: number;
}

interface FactSheetResponse {
  Code: string;
  Message: string;
  Status: boolean;
  timestamp: string;
  Data: FundResponseData[];
  pagination: {
    current_page: number;
    has_next_page: boolean;
    has_previous_page: boolean;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
  filters_applied: {
    fund_filter: string;
    view_type: string;
    allowed_fund_codes: string[];
  };
}

/**
 * Fact sheet service
 * @returns axios promise
 */
export const fetchFactSheetService = async (
  params?: fetchFactSheetParams
): Promise<FactSheetResponse> => {
  try {
    const response = await axios.get<FactSheetResponse>("/api/products/fact-sheet", {
      params,
    });

    // Format the yield property to 2 decimal places
    response.data.Data = response.data.Data.map((fund) => ({
      ...fund,
      yield: parseFloat(fund.yield.toFixed(2)),
    }));

    return response.data;
  } catch (error) {
    console.error("Error fetching fact sheet:", error);
    throw error;
  }
};

/**
 * Hook for fetching and caching fact sheet
 * @returns Query result with fact sheet data
 */
export const useFetchFactSheet = ({
  params,
  options,
}: {
  params?: fetchFactSheetParams;
  options?: Partial<UseQueryOptions<FactSheetResponse, Error>>;
}) => {
  const query = useQuery({
    queryKey: ["fact-sheet", params],
    queryFn: () => fetchFactSheetService(params),
    ...options,
  });
  return query;
};

export const useFetchFactSheetInfinite = ({
  params,
}: {
  params?: fetchFactSheetParams;
}) => {
  const query = useInfiniteQuery({
    queryKey: ["fact-sheet-infinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchFactSheetService({
        ...params,
        page: pageParam,
      });
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.has_next_page) {
        return lastPage.pagination.current_page + 1;
      }
      return undefined;
    },
  });
  return query;
};
