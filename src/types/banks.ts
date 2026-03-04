export interface BanksResponseData {
  id: number;
  cbn_code: string;
  name: string;
  slug: string;
  is_active: boolean;
  description: string;
  website: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
}

export interface FetchBanksResponse {
  message: string;
  status: boolean;
  code: number;
  data: BanksResponseData[];
  count: number;
  timestamp: string;
}

// Bank Name Inquiry
export interface NameInquiryRequestBody {
  accountNumber: string;
  cbnCode: string;
}
export interface NameInquiryResponseData {
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
}
export interface NameInquiryResponse {
  Status: boolean;
  Code: string;
  Message: string;
  Data: {
    accountNumber: string;
    cbnCode: string;
    accountName: string;
    statusID: number;
    statusText: string;
  };
  timestamp: string;
}
