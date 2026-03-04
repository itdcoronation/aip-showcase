"use client";
import { ROUTES } from "@/lib/routes";
import { OnboardingStepData } from "@/modules/onboarding/_components/layout";
import useOnboardingStore from "@/store/onboarding";
import { ReactNode, useEffect } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const steps: OnboardingStepData[] = [
    {
      title: "Company information",
      description: "Company information",
      id: "company",
      path: ROUTES.onboarding_institution_company,
    },
    {
      title: "Bank information",
      description: "Input your bank information",
      id: "bank",
      path: ROUTES.onboarding_institution_bank,
    },
    {
      title: "Signatories",
      description: "Input your signatory information",
      id: "signatories",
      path: ROUTES.onboarding_institution_signatories,
    },
    {
      title: "KYB",
      description: "Provide your kyb Information",
      id: "kyb",
      path: ROUTES.onboarding_institution_kyb,
    },
    {
      title: "Risk Profiling",
      description: "Provide your risk profiling Information",
      id: "risk-profiling",
      path: ROUTES.onboarding_institution_risk_profiling,
    },
  ];

  const { setSteps } = useOnboardingStore();

  useEffect(() => {
    setSteps(steps);
  }, []);

  return children;
};

export default Layout;
