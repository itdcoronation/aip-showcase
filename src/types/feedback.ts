export interface FeedbackRequestBody {
  email: string;
  message?: string;
  rating: number
}

export interface FeedbackResponse {
  status: string;
  message: string;
  data: null;
  timestamp: string;
}
