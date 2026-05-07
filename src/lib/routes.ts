export enum ROUTES {
  // Authentication
  login = "/",
  verify_email = "/verify-email",
  signup = "/signup",
  forgot_password = "/forgot-password",
  new_password = "/new-password",
  reset_password_otp = "/reset-password-otp",

  // Onboardig
  onboarding_individual_personal = "/onboarding/individual/personal-information",
  onboarding_individual_bank = "/onboarding/individual/bank-information",
  onboarding_individual_kyc = "/onboarding/individual/kyc",
  onboarding_individual_next_of_kin = "/onboarding/individual/next-of-kin",
  onboarding_individual_risk_profiling = "/onboarding/individual/risk-profiling",
  onboarding_success = "/onboarding/success",
  onboarding_joint_personal = "/onboarding/joint/personal-information",
  onboarding_joint_bank = "/onboarding/joint/bank-information",
  onboarding_joint_kyc = "/onboarding/joint/kyc",
  onboarding_joint_next_of_kin = "/onboarding/joint/next-of-kin",
  onboarding_joint_risk_profiling = "/onboarding/joint/risk-profiling",
  onboarding_institution_company = "/onboarding/institution/company-information",
  onboarding_institution_bank = "/onboarding/institution/bank-information",
  onboarding_institution_signatories = "/onboarding/institution/signatories",
  onboarding_institution_kyb = "/onboarding/institution/kyb",
  onboarding_institution_risk_profiling = "/onboarding/institution/risk-profiling",
  service_hub_statement_request = "/service-hub/request-account-statement",
  onboarding_minor_account_personal = "/onboarding/minor/personal-information",
  onboarding_minor_account_kyc = "/onboarding/minor/kyc",

  // Dashboard
  overview = "/overview",
  rec_products = "/recommended-products",
  equities = "/equities",
  insurance = "/insurance",
  insurance_policy = "/insurance/policy",
  explore_equities = "/equities/explore",
  mutual_funds = "/mutual-funds",
  fixed_income = "/fixed-income",
  trustees = "/trustees",
  simple_will = "/simple-will",
  private_trust = "/private-trust",
  comprehensive_will = "/comprehensive-will",
  equities_fund = "/equities/fund",
  equities_withdraw = "/equities/withdraw",

  // Service hub
  service_hub_account = "/service-hub/account",
  service_hub_embassy = "/service-hub/embassy-letter",
  service_hub_embassy_request = "/service-hub/request-embassy-letter",
  service_hub_statement = "/service-hub/account-statement",
  service_hub_minor_account = "/service-hub/minor-account",
  service_hub_minor_account_create = "/onboarding/minor-account",
  service_hub_referral = "/service-hub/referral",
  service_hub_recurring_payments = "/service-hub/recurring-payments",
  service_hub_faqs = "/service-hub/faqs",


  // Settings
  settings_profile = "/settings/profile",
  settings_kyc = "/settings/kyc",
  settings_kyb = "/settings/kyb",
  settings_bank_info = "/settings/bank-information",
  settings_next_of_kin = "/settings/next-of-kin",
  settings_risk_profile = "/settings/risk-profile",
  settings_reset_password = "/settings/reset-password",
  settings_reset_password_form = "/settings/reset-password-form",
  settings_reset_signatories = "/settings/signatories",
  
  // Contact
  contact = "/contact-us",
}
