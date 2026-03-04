export interface ProductFundDetails {
  code: string;
  name: string;
  allocated: boolean;
  status: string;
}

export interface ProductRecommendationsResponse {
  status: string;
  message: string;
  data: {
    user_profile: {
      risk_category: string;
      income_segment: string;
      profile_name: string;
      risk_score: number;
      income_score: string;
    };
    allocation_summary: {
      allocation_id: number;
      total_funds_allocated: number;
      allocated_funds: string[];
      created_at: string;
      updated_at: string;
    };
    fund_details: Array<ProductFundDetails>;
  };
  mongo_id: string;
  timestamp: string;
}
