export enum InsuranceType {
  Private = "private",
  Commercial = "commercial",
  Other = "other",
}

export type InsurancePolicyKind = InsuranceType | (string & {});

export type InsurancePolicyProductType =
  | "third_party_motor_insurance"
  | (string & {});

export type InsurancePolicyProcessingStatus =
  | "Completed"
  | "Pending"
  | "Failed"
  | (string & {});

export type InsurancePolicyDocumentType =
  | "policy"
  | "certificate"
  | (string & {});

export interface PolicyData {
  id: string;
  name: string;
  policyNumber: string;
  type: InsuranceType;
  amount: number;
  status: "active" | "inactive" | "pending";
}

export interface InsuranceProduct {
  id: string;
  name: string;
  description: string;
  type: InsuranceType;
  isComingSoon?: boolean;
}

export interface InsuranceProductOption {
  product_code: string;
  cover_code: string;
  premium: number;
  sum_insured: number;
}

export type InsuranceVehicleProducts = Record<string, InsuranceProductOption>;

export interface ThirdPartyMotorInsuranceProducts {
  private: InsuranceVehicleProducts;
  commercial: InsuranceVehicleProducts;
}

export interface InsuranceProductsData {
  third_party_motor_insurance: ThirdPartyMotorInsuranceProducts;
}

export interface InsuranceProductsResponse {
  success: boolean;
  data: InsuranceProductsData;
  message?: string;
}

export interface PolicyItem extends PolicyData {
  vehicle: {
    make: string;
    plate: string;
  };
  validFrom: string;
  validTo: string;
}

export interface InsurancePolicyTypeSnapshot {
  kind: InsurancePolicyKind;
  premium: number;
  cover_code: string;
  sum_insured: number;
  product_code: string;
  vehicle_type?: string;
}

export interface InsurancePolicyVehiclePayload {
  color: string;
  vin_number: string;
  vehicle_make: string;
  vehicle_type: string;
  engine_number: string;
  vehicle_model: string;
  license_number: string;
  production_year: number;
  proof_of_ownership_media_id: number;
}

export interface InsurancePolicyPolicyholderPayload {
  city: string;
  email: string;
  phone: string;
  state: string;
  title: string;
  street: string;
  country: string;
  last_name: string;
  birth_date: string;
  first_name: string;
  middle_name: string | null;
  house_number: string;
  identification_document_media_id: number;
}

export interface InsurancePolicyPayload {
  vehicle: InsurancePolicyVehiclePayload;
  policyholder: InsurancePolicyPolicyholderPayload;
}

export interface InsurancePolicyMedia {
  id: number;
  url: string;
  path: string;
  original_name: string;
  size: number;
  mime_type: string;
  owner_id: number;
  meta: unknown;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InsurancePolicyDocument {
  id: number;
  type: InsurancePolicyDocumentType;
  insurance_policy_id: number;
  media_id: number;
  created_at: string;
  updated_at: string;
  media: InsurancePolicyMedia;
}

export interface InsurancePolicyApiItem {
  id: number;
  start_date: string;
  end_date: string;
  status: PolicyStatus;
  duration: number;
  policy_number: string | null;
  user_id: number;
  type: InsurancePolicyProductType;
  insurance_policy_type_snapshot: InsurancePolicyTypeSnapshot;
  insurance_policy_payload: InsurancePolicyPayload;
  paystack_transaction_reference: string | null;
  renew_insurance_policy_id: number | null;
  payment_date: string | null;
  processing_status: InsurancePolicyProcessingStatus;
  processing_updated_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  policy_media: InsurancePolicyDocument[];
  media: InsurancePolicyMedia[];
}

export interface VehicleLookupData {
  vehicleMake: string;
  vehicleModel: string;
  productionYear: string;
  vinNumber: string;
  engineNumber: string;
  color: string;
}

export interface PersonalInfoData {
  title: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  state: string;
  city: string;
  houseNumber: string;
  residentialAddress: string;
  proofOfIdentity?: File;
}

export interface VehicleInfoData {
  vehicleType: string;
  make: string;
  model: string;
  year: string;
  start_date?: string;
  plateNumber: string;
  chassisNumber: string;
  engineNumber: string;
  color: string;
  useType: string;
  proofOfOwnership?: File;
}

export interface VehicleLookupResponse {
  success: boolean;
  data: VehicleLookupData;
  message?: string;
}

export interface PolicyDetail {
  policyNumber: string;
  insuranceType: string;
  coverageType: string;
  startDate: string;
  endDate: string;
  validUntil: string;
  annualPremium: number;
  status: "active" | "inactive" | "pending";
  vehicle: {
    make: string;
    plate: string;
    chassisNumber: string;
    engineNumber: string;
    value: number;
  };
  coverage: {
    thirdPartyLiability: number;
    ownDamage: "Covered" | "Not covered";
    theft: "Covered" | "Not covered";
    fire: "Covered" | "Not covered";
    thirdPartyProperty: "Covered" | "Not covered";
  };
}

export type PolicyStatus =
  | "draft"
  | "issued"
  | "active"
  | "expired"
  | "upcoming"
  | "pending"
  | "awaiting_payment_process"
  | "payment_failed";
