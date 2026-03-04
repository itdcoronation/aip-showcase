// Risk profile response type
export interface RiskAnswers {
  risk_q1: string; // "A" | "B" | "C" | "D"
  risk_q2: string; // "A" | "B" | "C" | "D"
  risk_q3: string; // "A" | "B" | "C" | "D"
  risk_q4: string; // "A" | "B" | "C" | "D"
  risk_q5: string; // "A" | "B" | "C" | "D"
  risk_q6: string; // "A" | "B" | "C" | "D"
  risk_q7: string; // "A" | "B" | "C" | "D"
  risk_q8: string; // "A" | "B" | "C" | "D"
  risk_q9: string; // "A" | "B" | "C" | "D"
  risk_q10: string; // "A" | "B" | "C" | "D"
}
export interface FetchRiskProfileResponse {
  status: string;
  message: string;
  data: {
    id: number;
    mongo_id: string;
    aip_user_id: string;
    profile_name: string;
    risk_category: string;
    income_segment: string;
    risk_score: number;
    income_score: string;
    wealth_segment: string;
    assessment_method: string;
    created_at: string;
    updated_at: string;
    risk_answers: RiskAnswers;
  };
  mongo_id: string;
  timestamp: string;
}

export enum riskAnswerMapping {
  employment_status = "risk_q1",
  income_range = "risk_q2",
  investment_percent = "risk_q3",
  investment_experience = "risk_q4",
  withdrawal = "risk_q5",
  goal = "risk_q6",
  portfolio = "risk_q7",
}
