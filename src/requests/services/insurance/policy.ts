import { PolicyStatus } from "@/types/insurance";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export interface InsurancePolicyMutationResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: unknown;
}

export interface DownloadPolicyResponse {
  download_url?: {
    STATUS?: string;
    DATA?: string;
    DATA2?: string;
    DESCRIPTION?: string;
  };
}

export interface FetchInsurancePoliciesParams {
  statuses?: PolicyStatus[];
  page?: number;
  per_page?: number;
}

export const createDraftPolicyService = async (
  data: FormData,
): Promise<InsurancePolicyMutationResponse> => {
  try {
    const response = await axios.post<InsurancePolicyMutationResponse>(
      "/api/insurance/policies/create",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error creating insurance draft policy:", error);
    return Promise.reject(error);
  }
};

export const updateDraftPolicyService = async ({
  policyId,
  data,
}: {
  policyId: string | number;
  data: FormData;
}): Promise<InsurancePolicyMutationResponse> => {
  try {
    const response = await axios.post<InsurancePolicyMutationResponse>(
      `/api/insurance/policies/${policyId}/update`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error updating insurance draft policy:", error);
    return Promise.reject(error);
  }
};

export const deleteDraftPolicyService = async (
  policyId: string,
): Promise<InsurancePolicyMutationResponse> => {
  try {
    const response = await axios.delete<InsurancePolicyMutationResponse>(
      `/api/insurance/policies/${policyId}/delete`,
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting insurance draft policy:", error);
    return Promise.reject(error);
  }
};

export const renewPolicyService = async (
  policyId: string,
): Promise<InsurancePolicyMutationResponse> => {
  try {
    const response = await axios.post<InsurancePolicyMutationResponse>(
      `/api/insurance/policies/${policyId}/renew`,
    );

    return response.data;
  } catch (error) {
    console.error("Error renewing insurance policy:", error);
    return Promise.reject(error);
  }
};

export const downloadPolicyService = async (
  policyId: string,
): Promise<InsurancePolicyMutationResponse<DownloadPolicyResponse>> => {
  try {
    const response = await axios.post<
      InsurancePolicyMutationResponse<DownloadPolicyResponse>
    >(`/api/insurance/policies/${policyId}/download`, {});

    return response.data;
  } catch (error) {
    console.error("Error downloading insurance policy:", error);
    return Promise.reject(error);
  }
};

export const verifyPolicyPaymentService = async (
  reference: string,
  policyId: string | number,
): Promise<InsurancePolicyMutationResponse> => {
  try {
    const response = await axios.post<InsurancePolicyMutationResponse>(
      `/api/insurance/policies/verify-payment`,
      {
        reference,
        policyId,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error verifying insurance policy payment:", error);
    return Promise.reject(error);
  }
};

export const fetchInsurancePolicyByIdService = async (
  policyId: string | number,
): Promise<InsurancePolicyMutationResponse> => {
  try {
    const response = await axios.get<InsurancePolicyMutationResponse>(
      `/api/insurance/policies/${policyId}`,
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching insurance policy by ID:", error);
    return Promise.reject(error);
  }
};

export const fetchInsurancePoliciesService = async (
  paramsOrStatuses: FetchInsurancePoliciesParams | PolicyStatus[] = ["active"],
): Promise<InsurancePolicyMutationResponse> => {
  try {
    const payload = Array.isArray(paramsOrStatuses)
      ? { statuses: paramsOrStatuses }
      : paramsOrStatuses;

    const statuses = payload.statuses?.length ? payload.statuses : ["active"];
    const page = payload.page ?? 1;
    const perPage = payload.per_page ?? 10;

    const params = new URLSearchParams();

    statuses.forEach((status) => {
      params.append("status[]", status);
    });

    params.append("page", String(page));
    params.append("per_page", String(perPage));

    const response = await axios.get<InsurancePolicyMutationResponse>(
      `/api/insurance/policies?${params.toString()}`,
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching insurance policies:", error);
    return Promise.reject(error);
  }
};

export const useCreateDraftPolicy = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: InsurancePolicyMutationResponse) => void;
  onError?: (error: AxiosError<unknown>) => void;
} = {}) => {
  return useMutation({
    mutationFn: createDraftPolicyService,
    onSuccess,
    onError,
    mutationKey: ["create-draft-policy"],
  });
};

export const useDeleteDraftPolicy = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: InsurancePolicyMutationResponse) => void;
  onError?: (error: AxiosError<unknown>) => void;
} = {}) => {
  return useMutation({
    mutationFn: deleteDraftPolicyService,
    onSuccess,
    onError,
    mutationKey: ["delete-draft-policy"],
  });
};

export const useUpdateDraftPolicy = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: InsurancePolicyMutationResponse) => void;
  onError?: (error: AxiosError<unknown>) => void;
} = {}) => {
  return useMutation({
    mutationFn: updateDraftPolicyService,
    onSuccess,
    onError,
    mutationKey: ["update-draft-policy"],
  });
};

export const useRenewPolicy = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: InsurancePolicyMutationResponse) => void;
  onError?: (error: AxiosError<unknown>) => void;
} = {}) => {
  return useMutation({
    mutationFn: renewPolicyService,
    onSuccess,
    onError,
    mutationKey: ["renew-policy"],
  });
};

export const useDownloadPolicy = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: InsurancePolicyMutationResponse<DownloadPolicyResponse>,
    policyId: string,
  ) => void;
  onError?: (error: AxiosError<unknown>) => void;
} = {}) => {
  return useMutation({
    mutationFn: downloadPolicyService,
    onSuccess,
    onError,
    mutationKey: ["download-policy"],
  });
};

export const useFetchInsurancePolicies = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: InsurancePolicyMutationResponse) => void;
  onError?: (error: AxiosError<unknown>) => void;
} = {}) => {
  return useMutation({
    mutationFn: fetchInsurancePoliciesService,
    onSuccess,
    onError,
    mutationKey: ["fetch-insurance-policies"],
  });
};

export const useVerifyPolicyPayment = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: InsurancePolicyMutationResponse) => void;
  onError?: (error: AxiosError<unknown>) => void;
} = {}) => {
  return useMutation({
    mutationFn: ({
      reference,
      policyId,
    }: {
      reference: string;
      policyId: string;
    }) => verifyPolicyPaymentService(reference, policyId),
    onSuccess,
    onError,
    mutationKey: ["verify-policy-payment"],
  });
};

export const useFetchInsurancePolicyById = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: InsurancePolicyMutationResponse) => void;
  onError?: (error: AxiosError<unknown>) => void;
} = {}) => {
  return useMutation({
    mutationFn: ({ policyId }: { policyId: string }) =>
      fetchInsurancePolicyByIdService(policyId),
    onSuccess,
    onError,
    mutationKey: ["fetch-insurance-policy-by-id"],
  });
};
