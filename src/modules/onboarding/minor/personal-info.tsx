"use client";
import useOnboardingStore from "@/store/onboarding";
import { useEffect } from "react";
import { FormHeader } from "@/components/form/header";
import {
  PersonalInfoForm,
  PersonalInfoFormData,
} from "./_components/personal-info-form";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";

const MinorPersonalInfoUI: React.FC = () => {
  const router = useRouter();

  const { markStepComplete, setCurrentStep } = useOnboardingStore();

  useEffect(() => {
    setCurrentStep("personal");
  }, []);

  const handleSubmit = (data: PersonalInfoFormData) => {
    console.log(data);
    markStepComplete("personal");
    router.push(ROUTES.onboarding_minor_account_kyc);
  };

  return (
    <>
      <FormHeader
        title="Minor’s personal information"
        description="Tell us a bit about your Ward"
        titleType="h2"
      />
      <PersonalInfoForm submit={handleSubmit} />
    </>
  );
};

export { MinorPersonalInfoUI };
