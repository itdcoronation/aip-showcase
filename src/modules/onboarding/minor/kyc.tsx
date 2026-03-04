"use client";
import useOnboardingStore from "@/store/onboarding";
import { useEffect } from "react";
import { FormHeader } from "@/components/form/header";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { KYCForm } from "./_components/kyc-form";

const MinorKYCUI: React.FC = () => {
  const router = useRouter();

  const { markStepComplete, setCurrentStep } = useOnboardingStore();

  useEffect(() => {
    setCurrentStep("kyc");
  }, []);

  const handleSubmit = (data: any) => {
    console.log(data);
    markStepComplete("kyc");
    router.push(ROUTES.service_hub_minor_account);
  };

  return (
    <>
      <FormHeader
        title="Minor’s KYC"
        description="Help us verify your ward's Identity."
        titleType="h2"
      />
      <KYCForm submit={handleSubmit} />
    </>
  );
};

export { MinorKYCUI };
