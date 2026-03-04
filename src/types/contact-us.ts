export interface ContactUsRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  enquiryRelatedTo: string;
  message: string;
}

export interface ContactUsResponse {
  status: string;
  message: string;
  data: null;
  timestamp: string;
}
