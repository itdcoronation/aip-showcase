"use client";
import useOnboardingStore from "@/store/onboarding";
import { useEffect } from "react";
import { FormHeader } from "@/components/form/header";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { BankInfoData, BankInfoForm } from "../_components/bank-info-form";

const InstitutionBankInfoUI: React.FC = () => {
  const router = useRouter();

  const { setCurrentStep, markStepComplete } = useOnboardingStore();

  useEffect(() => {
    setCurrentStep("bank");
  }, []);

  const handleSubmit = (data: BankInfoData[]) => {
    console.log(data);
    markStepComplete("bank");
    router.push(ROUTES.onboarding_institution_signatories);
  };

  return (
    <>
      <FormHeader
        title="Bank information"
        description="Provide your bank details for seamless transactions."
        titleType="h2"
      />
      <BankInfoForm submit={handleSubmit} />
    </>
  );
};

export { InstitutionBankInfoUI };
