/*
=================================
TYPES FOR ONBOARDING
- File: src/types/onboarding.ts
- Description: Type definitions for onboarding-related requests and responses.
=================================
*/

// Initiate Onboarding types
export interface initiateOnboardingRequestBody {
  user_id: string; // use the user's email or unique identifier
}
export type OnboardingStatus = "draft" | "submitted" | "approved" | "rejected";

export interface CompletionStatusData {
  personal_info: boolean;
  bank_info: boolean;
  next_of_kin: boolean;
  kyc: boolean;
  risk_profile: boolean;
  completion_percentage: string;
  status: OnboardingStatus;
}

export interface initiateOnboardingResponse {
  success: boolean;
  message: string;
  data: {
    staging_id: string;
    status: OnboardingStatus;
    completion_status: CompletionStatusData;
    created_at: string;
    updated_at: string;
  };
}

// Retrieve Onboarding types

export interface RetrieveOnboardingData {
  id: number;
  staging_id: string;
  user_id: string;
  session_id: null | string;
  surname: null | string;
  first_name: null | string;
  other_names: null | string;
  account_type: null | string;
  title: null | string;
  comp_name: null | string;
  sex: null | number;
  date_of_birth: null | string;
  state: null | string;
  state_code: null | string;
  lga: null | string;
  bvn: null | string;
  permanent_address: null | string;
  nationality: null | string;
  postal_code: null | string;
  telephone: null | string;
  email_address: null | string;
  city: null | string;
  country: null | string;
  bank_acct_number: null | string;
  bank_code: null | string;
  bank_code_platform_cosec: null | string;
  bank_code_platform_cam: null | string;
  bank_name: null | string;
  bank_acct_name: null | string;
  next_of_kin: null | string;
  next_of_kin_phone_number: null | string;
  mothers_maiden_name: null | string;
  identity_document_type: null | string;
  identity_document_number: null | string;
  kyc_id_type: null | string;
  kyc_link: null | string;
  kyc_signature: null | string;
  kyc_photo: null | string;
  kyc_address: null | string;
  has_personal_info: boolean;
  has_bank_info: boolean;
  has_next_of_kin: boolean;
  has_kyc: boolean;
  has_risk_profile: boolean;
  mongo_id: null | string;
  cam_id: null | string;
  csec_id: null | string;
  status: string;
  completion_percentage: string;
  last_updated_section: null | string;
  last_updated_by: string;
  metadata: null | string;
  submitted_at: null | string;
  approved_at: null | string;
  rejection_reason: null | string;
  created_at: string;
  updated_at: string;
  is_diaspora: boolean;
  alternate_phone: null;
  bank_acct_number_alt: null;
  bank_code_alt: null;
  bank_code_platform_cosec_alt: null;
  bank_code_platform_cam_alt: null;
  bank_name_alt: null;
  bank_acct_name_alt: null;
  next_of_kin_relationship: null;
  next_of_kin_email: null;
}

export interface RetrieveOnboardingResponse {
  success: boolean;
  message: string;
  data: RetrieveOnboardingData;
}

// Personal Info types
export interface PersonalInfoRequestBody {
  surname: string;
  first_name: string;
  other_names?: string;
  account_type: string; // "IND" for Individual,
  title: string;
  sex: number;
  date_of_birth: string;
  state: string;
  state_code: string;
  lga: string;
  nationality: string;
  telephone: string;
  email_address: string;
  city: string;
  country: string;
  permanent_address: string;
  mothers_maiden_name: string;
  alternate_phone?: string;
  bvn: string;
  postal_code: string;
  is_diaspora: number; // 1 for Yes, 0 for No
}

export interface PersonalInfoResponse {
  success: boolean;
  message: string;
  data: {
    staging_id: string;
    completion_status: CompletionStatusData;
    updated_at: string;
  };
}

// Bank Info types
export interface BankInfoRequestBody {
  bank_acct_number: string;
  bank_code: string;
  bank_code_platform_cosec: string;
  bank_code_platform_cam: string;
  bank_name: string;
  bank_acct_name: string;
  // Alternate Bank Details
  bank_acct_number_alt?: string;
  bank_code_alt?: string;
  bank_code_platform_cosec_alt?: string;
  bank_code_platform_cam_alt?: string;
  bank_name_alt?: string;
  bank_acct_name_alt?: string;
}

export interface BankInfoResponse {
  success: boolean;
  message: string;
  data: {
    staging_id: string;
    completion_status: CompletionStatusData;
    updated_at: string;
  };
}

// KYC Info types
export interface KYCRequestBody {
  identity_document_type: string;
  identity_document_number: string;
  kyc_link: string; // base64 string of the uploaded document
  kyc_signature: string; // base64 string of the uploaded signature image
  kyc_photo: string; // base64 string of the uploaded passport photo
  kyc_address: string; // base64 string of the uploaded proof of address document
}

export interface KYCResponse {
  success: boolean;
  message: string;
  data: {
    staging_id: string;
    completion_status: CompletionStatusData;
    updated_at: string;
  };
}

// Next of Kin types
export interface NextOfKinRequestBody {
  next_of_kin: string;
  next_of_kin_relationship: string;
  next_of_kin_phone_number: string;
  next_of_kin_email: string;
}

export interface NextOfKinResponse {
  success: boolean;
  message: string;
  data: {
    staging_id: string;
    completion_status: CompletionStatusData;
    updated_at: string;
  };
}

// Risk Profile types
export interface RiskProfileRequestBody {
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
  staging_id: string
}

export interface RiskProfileResponse {
  success: boolean;
  message: string;
  data: {
    staging_id: string;
    completion_status: CompletionStatusData;
    updated_at: string;
  };
}
