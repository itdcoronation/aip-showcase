"use client";
import useOnboardingStore from "@/store/onboarding";
import { useEffect } from "react";
import { FormHeader } from "@/components/form/header";
import { ROUTES } from "@/lib/routes";
import { useRouter, useSearchParams } from "next/navigation";
import {
  RiskProfilingForm,
  RiskProfilingFormData,
} from "../_components/risk-profiling-form";
import { useSubmitRiskProfile } from "@/requests/services/onboarding/risk-profile";
import { toast } from "sonner";
import { useGetOnboardingSteps } from "@/requests/services/onboarding/status";
import { useQueryClient } from "@tanstack/react-query";
import useUserStore from "@/store/user";
import { useFetchRiskProfile } from "@/requests/services/user/risk-profile";
import { riskAnswerMapping } from "@/types/risk-profile";

const IndividualRiskProfilingUI: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const retake = searchParams.get("retake");
  const queryClient = useQueryClient();
  const { refetch } = useGetOnboardingSteps();
  const { markStepComplete, setCurrentStep } = useOnboardingStore();
  const { staging_id, risk_profile } = useUserStore();
  const { refetch: refetchRiskProfile } = useFetchRiskProfile();

  useEffect(() => {
    setCurrentStep("risk-profiling");
  }, []);

  const { mutate, isPending } = useSubmitRiskProfile({
    onSuccess: (data) => {
      markStepComplete("risk-profiling");
      toast.success(data.message ?? "Risk profiling saved successfully");
      refetch();
      refetchRiskProfile();
      queryClient.invalidateQueries({
        queryKey: ["fetch-onboarding-user-data"],
      });
      if (retake) {
        router.push(`${ROUTES.settings_risk_profile}?updated=true`);
        return;
      }

      router.push(ROUTES.onboarding_success);
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "An error occurred. Please try again."
      );
    },
  });

  const handleSubmit = (data: RiskProfilingFormData) => {
    console.log(data);

    mutate({
      risk_q1: data.employment_status,
      risk_q2: data.income_range,
      risk_q3: data.investment_percent,
      risk_q4: data.investment_experience,
      risk_q5: data.withdrawal,
      risk_q6: data.goal,
      risk_q7: data.portfolio,
      risk_q8: "A",
      risk_q9: "A",
      risk_q10: "A",
      staging_id,
    });
  };

  return (
    <>
      <FormHeader
        title="Risk profiling"
        description="Help us understand your risk tolerance to recommend suitable investment options aligned with your financial goals."
        titleType="h2"
      />
      <RiskProfilingForm
        submit={handleSubmit}
        initData={{
          employment_status:
            risk_profile.risk_answers?.[riskAnswerMapping.employment_status] ||
            "",
          income_range:
            risk_profile.risk_answers?.[riskAnswerMapping.income_range] || "",
          investment_percent:
            risk_profile.risk_answers?.[riskAnswerMapping.investment_percent] ||
            "",
          investment_experience:
            risk_profile.risk_answers?.[
              riskAnswerMapping.investment_experience
            ] || "",
          withdrawal:
            risk_profile.risk_answers?.[riskAnswerMapping.withdrawal] || "",
          goal: risk_profile.risk_answers?.[riskAnswerMapping.goal] || "",
          portfolio:
            risk_profile.risk_answers?.[riskAnswerMapping.portfolio] || "",
        }}
        isPending={isPending}
      />
    </>
  );
};

export { IndividualRiskProfilingUI };
