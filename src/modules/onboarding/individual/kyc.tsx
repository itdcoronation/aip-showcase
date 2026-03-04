"use client";
import useOnboardingStore from "@/store/onboarding";
import { useEffect } from "react";
import { FormHeader } from "@/components/form/header";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { KYCForm, KYCFormData } from "../_components/kyc-form";
import { useSubmitKYC } from "@/requests/services/onboarding/kyc";
import useUserStore from "@/store/user";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useGetOnboardingSteps } from "@/requests/services/onboarding/status";

const IndividualKYCUI: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refetch } = useGetOnboardingSteps();

  const { markStepComplete, setCurrentStep, data } = useOnboardingStore();
  const { staging_id } = useUserStore();

  const { mutate, isPending } = useSubmitKYC({
    id: staging_id,
    onSuccess: (data) => {
      markStepComplete("kyc");
      toast.success(data.message ?? "KYC information saved successfully");
      router.push(ROUTES.onboarding_individual_next_of_kin);
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
    setCurrentStep("kyc");
  }, []);

  const handleSubmit = async (data: KYCFormData) => {
    const kycData = {
      identity_document_type: data.identity_document_type,
      identity_document_number: data.identity_document_no,
      kyc_address: data.proof_of_address[0],
      kyc_link: data.proof_of_identity[0],
      kyc_photo: data.passport_photo[0],
      kyc_signature: data.signature[0],
    };

    const formData = new FormData();
    Object.entries(kycData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    mutate(formData);
  };

  return (
    <>
      <FormHeader
        title="KYC"
        description="Help us verify your identity by providing the required documents."
        titleType="h2"
      />
      <KYCForm
        submit={handleSubmit}
        isPending={isPending}
        initData={{
          identity_document_type: data?.identity_document_type || "",
          identity_document_no: data?.identity_document_number || "",
          // passport_photo: data?.kyc_photo
          //   ? base64ToFileList(
          //       data.kyc_photo,
          //       `${basic_info.first_name} - Passport Photograph`
          //     )
          //   : [],
          // proof_of_identity: data?.kyc_link
          //   ? base64ToFileList(
          //       data.kyc_link,
          //       `${basic_info.first_name} - ${data?.identity_document_type}`
          //     )
          //   : [],
          // proof_of_address: data?.kyc_address
          //   ? base64ToFileList(
          //       data.kyc_address,
          //       `${basic_info.first_name} - Proof of Address`
          //     )
          //   : [],
          // signature: data?.kyc_signature
          //   ? base64ToFileList(
          //       data.kyc_signature,
          //       `${basic_info.first_name} - Signature`
          //     )
          //   : [],
        }}
      />
    </>
  );
};

export { IndividualKYCUI };
