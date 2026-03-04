// Basic information response type
export interface BasicInformationResponse {
  data: {
    user: {
      id: number;
      first_name: string;
      last_name: string;
      name: string;
      email: string;
      bvn: string;
      phone_number: string;
      referral_code: string | null;
      email_confirmed: boolean;
      last_login: string;
      created_at: string;
    };
    mongo_id: any;
    staging_profile_id: string;
    is_profile_complete: boolean;
  };
  success: boolean;
}

// Change password request and response types
export interface ChangePasswordRequestBody {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ChangePasswordResponse {
  status: string;
  message: string;
  data: null;
  timestamp: string;
}

// Generate statement request and response types
export interface GenerateStatementRequestBody {
  fundcode: string;
  start_date: string; //  YYYY-MM-DD format e.g. 2025-09-29
  end_date: string; // YYYY-MM-DD format e.g. 2025-09-29
}

export interface GenerateStatementResponse {
  status: string;
  message: string;
  data: {
    statement_id: string;
    generated_at: string;
    download_url: string;
  };
  timestamp: string;
}
