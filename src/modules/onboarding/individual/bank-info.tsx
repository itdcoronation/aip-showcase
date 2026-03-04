"use client";
import useOnboardingStore from "@/store/onboarding";
import { useEffect } from "react";
import { FormHeader } from "@/components/form/header";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { BankInfoData, BankInfoForm } from "../_components/bank-info-form";
import { useSubmitBankInfo } from "@/requests/services/onboarding/bank-info";
import useUserStore from "@/store/user";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useGetOnboardingSteps } from "@/requests/services/onboarding/status";

const IndividualBankInfoUI: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refetch } = useGetOnboardingSteps();

  const { setCurrentStep, markStepComplete, data } = useOnboardingStore();
  const { staging_id } = useUserStore();

  const { mutate, isPending } = useSubmitBankInfo({
    id: staging_id,
    onSuccess: (data) => {
      toast.success(data.message ?? "Bank information saved successfully");
      markStepComplete("bank");
      router.push(ROUTES.onboarding_individual_kyc);
      refetch();
      queryClient.invalidateQueries({
        queryKey: ["fetch-onboarding-user-data"],
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    },
  });

  useEffect(() => {
    setCurrentStep("bank");
  }, []);

  const handleSubmit = (data: BankInfoData[]) => {
    console.log(data);
    mutate({
      bank_name: data[0].bank_name,
      bank_acct_number: data[0].account_number,
      bank_acct_name: data[0].account_name,
      bank_code: data[0].bank,
      bank_code_platform_cosec: data[0].bank,
      bank_code_platform_cam: data[0].bank,
      bank_name_alt: data[1]?.bank_name,
      bank_acct_number_alt: data[1]?.account_number,
      bank_acct_name_alt: data[1]?.account_name,
      bank_code_alt: data[1]?.bank,
      bank_code_platform_cosec_alt: data[1]?.bank,
      bank_code_platform_cam_alt: data[1]?.bank,
    });
  };

  return (
    <>
      <FormHeader
        title="Bank information"
        description="Provide your bank details for seamless transactions."
        titleType="h2"
      />
      <BankInfoForm
        submit={handleSubmit}
        isPending={isPending}
        initData={
          data?.bank_name
            ? [
                {
                  bank_name: data?.bank_name || "",
                  account_number: data?.bank_acct_number || "",
                  account_name: data?.bank_acct_name || "",
                  bank: data?.bank_code || "",
                },
                ...(data?.bank_name_alt
                  ? [
                      {
                        bank_name: data?.bank_name_alt || "",
                        account_number: data?.bank_acct_number_alt || "",
                        account_name: data?.bank_acct_name_alt || "",
                        bank: data?.bank_code_alt || "",
                      },
                    ]
                  : []),
              ]
            : []
        }
      />
    </>
  );
};

export { IndividualBankInfoUI };
