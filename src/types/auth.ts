/*
=================================
TYPES FOR AUTHENTICATION
- File: src/types/auth.ts
- Description: Type definitions for authentication-related requests and responses.
=================================
*/

// Signup types
export interface signupRequestBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  bvn: string;
  phone_number: string;
}
export interface signupResponse {
  status: boolean;
  message: string;
  data: any | null;
  code: string; // e.g "200"
  errors: any | null;
}

// Login types
export interface loginRequestBody {
  email: string;
  password: string;
}
export interface loginResponseData {
  expires_in: number;
  is_profile_complete: boolean;
  refresh_token: string;
  token: string;
  is_password_reset: boolean;
  is_email_confirmed: boolean;
}
export interface loginResponse {
  data: loginResponseData;
  success: boolean;
}

// Forgot Password types
export interface forgotPasswordRequestBody {
  email: string;
  callback: string;
}
export interface forgotPasswordResponseData {
  message: string;
}
export interface forgotPasswordResponse {
  data: forgotPasswordResponseData;
  success: boolean;
}

// Reset Password types
export interface resetPasswordRequestBody {
  email: string;
  token: string;
  new_password: string;
  new_password_confirmation: string;
}
export interface resetPasswordResponse {
  [any: string]: any;
}

// Refresh Token types
export interface refreshTokenRequestBody {
  token: string;
}
export interface refreshTokenResponseData {
  token: string;
  refresh_token: string;
  expires_in: number;
  is_profile_complete: boolean;
}
export interface refreshTokenResponse {
  data: refreshTokenResponseData;
  success: boolean;
}

// Verify Email types
export interface verifyEmailRequestBody {
  email: string;
  otp: string;
}
export interface verifyEmailResponse {
  status: boolean;
  message: string;
  data: any | null;
  code: string; // e.g "200"
  errors: any | null;
}

// Resend OTP types
export interface resendOtpRequestBody {
  email: string;
}
export interface resendOtpResponse {
  status: boolean;
  message: string;
  data: any | null;
  code: string; // e.g "200"
  errors: any | null;
}
