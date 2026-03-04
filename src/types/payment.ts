/**
 * Payment types for card payment integration
 */

export interface PaymentSchedule {
  frequency: 'DAILY' |'WEEKLY' | 'MONTHLY' | 'YEARLY';
  start_date: string; // YYYY-MM-DD format
  end_date: string; // YYYY-MM-DD format
}

export interface InitiatePaymentRequestBody {
  amount: number;
  currency: 'NGN' | 'USD';
  callback_url: string;
  product_id: string;
  is_recurring: boolean;
  schedule?: PaymentSchedule;
}

export interface InitiatePaymentResponse {
  success: boolean;
  message?: string;
  data?: {
    payment_url?: string;
    reference?: string;
    authorization_url?: string;
    [key: string]: any;
  };
  error?: any;
}
