"use client";
import useOnboardingStore from "@/store/onboarding";
import { useEffect } from "react";
import { FormHeader } from "@/components/form/header";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { SignatoriesForm, SignatoriesFormData } from "../_components/signatories";

const InstitutionSignatoriesUI: React.FC = () => {
  const router = useRouter();

  const { setCurrentStep, markStepComplete } = useOnboardingStore();

  useEffect(() => {
    setCurrentStep("signatories");
  }, []);

  const handleSubmit = (data: SignatoriesFormData[]) => {
    console.log(data)
    markStepComplete("signatories");
    router.push(ROUTES.onboarding_institution_kyb);
  };

  return (
    <>
      <FormHeader
        title="Signatories"
        description="You can add up to 3 signatories to your account"
        titleType="h2"
      />
      <SignatoriesForm submit={handleSubmit} />
    </>
  );
};

export { InstitutionSignatoriesUI };
