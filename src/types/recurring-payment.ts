// API Response Types
export interface RecurringPaymentsResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    data: RecurringPaymentData[];
    count: number;
  };
  filters: {
    status: string;
  };
}

// Individual Payment Data
export interface RecurringPaymentData {
  recurring_id: string;
  transaction_ref: string;
  product: string;
  amount: string;
  currency: "NGN" | "USD";
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  next_charge_date: string;
  status: string;
  total_charges: number;
  created_at: string;
}

// Table Display Type
export interface RecurringPaymentTableData {
  transaction_ref: string;
  product: string;
  amount: string;
  currency: "NGN" | "USD";
  frequency: string;
  status: string;
}

// Cancel Request
export interface CancelRecurringPaymentRequest {
  transaction_ref: string;
  reason: string;
}

// Cancel Response
export interface CancelRecurringPaymentResponse {
  success: boolean;
  message: string;
  data?: any;
}
