"use client";
import useOnboardingStore from "@/store/onboarding";
import { useEffect } from "react";
import { FormHeader } from "@/components/form/header";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import {
  NextOfKinForm,
  NextOfKinFormData,
} from "../_components/next-of-kin-form";
import { useQueryClient } from "@tanstack/react-query";
import { useGetOnboardingSteps } from "@/requests/services/onboarding/status";
import useUserStore from "@/store/user";
import { useSubmitNextOfKin } from "@/requests/services/onboarding/next-of-kin";
import { toast } from "sonner";

const IndividualNextOfKinUI: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refetch } = useGetOnboardingSteps();

  const { markStepComplete, setCurrentStep, data } = useOnboardingStore();
  const { staging_id } = useUserStore();

  const { mutate, isPending } = useSubmitNextOfKin({
    id: staging_id,
    onSuccess: (data) => {
      markStepComplete("next-of-kin");
      toast.success(
        data.message ?? "Next of kin information saved successfully"
      );
      router.push(ROUTES.onboarding_individual_risk_profiling);
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
    setCurrentStep("next-of-kin");
  }, []);

  const handleSubmit = (data: NextOfKinFormData) => {
    console.log(data);
    mutate({
      next_of_kin: data.fullname,
      next_of_kin_email: data.email,
      next_of_kin_phone_number: data.phone,
      next_of_kin_relationship: data.relationship,
    });
  };

  return (
    <>
      <FormHeader
        title="Next of KIN"
        description="Kindly provide the details your Next of KIN"
        titleType="h2"
      />
      <NextOfKinForm
        submit={handleSubmit}
        initData={{
          fullname: data?.next_of_kin || "",
          email: data?.next_of_kin_email || "",
          phone: data?.next_of_kin_phone_number || "",
          relationship: data?.next_of_kin_relationship || "",
        }}
        isPending={isPending}
      />
    </>
  );
};

export { IndividualNextOfKinUI };
