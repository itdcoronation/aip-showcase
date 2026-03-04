"use client";
import useOnboardingStore from "@/store/onboarding";
import { useEffect } from "react";
import { FormHeader } from "@/components/form/header";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { KYBForm } from "../_components/kyb-form";

const InstitutionKYBUI: React.FC = () => {
  const router = useRouter();

  const { markStepComplete, setCurrentStep } = useOnboardingStore();

  useEffect(() => {
    setCurrentStep("kyb");
  }, []);

  const handleSubmit = (data: any) => {
    console.log(data);
    markStepComplete("kyb");
    router.push(ROUTES.onboarding_institution_risk_profiling);
  };

  return (
    <>
      <FormHeader
        title="KYB"
        description="Help us verify your company’s identity by providing the required documents."
        titleType="h2"
      />
      <KYBForm submit={handleSubmit} />
    </>
  );
};

export { InstitutionKYBUI };
