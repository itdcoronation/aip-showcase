"use client";
import useOnboardingStore from "@/store/onboarding";
import { useEffect } from "react";
import { FormHeader } from "@/components/form/header";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import {
  CompanyInfoForm,
  CompanyInfoFormData,
} from "../_components/company-info-form";

const InstitutionCompanyUI: React.FC = () => {
  const router = useRouter();

  const { markStepComplete, setCurrentStep } = useOnboardingStore();

  useEffect(() => {
    setCurrentStep("company");
  }, []);

  const handleSubmit = (data: CompanyInfoFormData) => {
    console.log(data);
    markStepComplete("company");
    router.push(ROUTES.onboarding_institution_bank);
  };

  return (
    <>
      <FormHeader
        title="Company information"
        description="Tell us a bit about your company"
        titleType="h2"
      />
      <CompanyInfoForm formId="individual-company-info" submit={handleSubmit} />
    </>
  );
};

export { InstitutionCompanyUI };
