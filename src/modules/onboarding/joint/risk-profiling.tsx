"use client";
import useOnboardingStore from "@/store/onboarding";
import { useEffect } from "react";
import { FormHeader } from "@/components/form/header";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import {
  RiskProfilingForm,
  RiskProfilingFormData,
} from "../_components/risk-profiling-form";

const JointRiskProfilingUI: React.FC = () => {
  const router = useRouter();

  const { markStepComplete, setCurrentStep } = useOnboardingStore();

  useEffect(() => {
    setCurrentStep("risk-profiling");
  }, []);

  const handleSubmit = (data: RiskProfilingFormData) => {
    console.log(data)
    markStepComplete("risk-profiling");
    router.push(ROUTES.onboarding_success);
  };

  return (
    <>
      <FormHeader
        title="Risk profiling"
        description="Help us understand your risk tolerance to recommend suitable investment options aligned with your financial goals."
        titleType="h2"
      />
      <RiskProfilingForm submit={handleSubmit} />
    </>
  );
};

export { JointRiskProfilingUI };
