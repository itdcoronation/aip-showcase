"use client";
import { ROUTES } from "@/lib/routes";
import { OnboardingStepData } from "@/modules/onboarding/_components/layout";
import useOnboardingStore from "@/store/onboarding";
import useUserStore from "@/store/user";
import { ReactNode, useEffect } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const steps: OnboardingStepData[] = [
    {
      title: "Personal information",
      description: "Personal information",
      id: "personal",
      path: ROUTES.onboarding_individual_personal,
      api_key: "personal_info",
    },
    {
      title: "Bank information",
      description: "Input your bank information",
      id: "bank",
      path: ROUTES.onboarding_individual_bank,
      api_key: "bank_info",
    },
    {
      title: "KYC",
      description: "Provide your kyc information",
      id: "kyc",
      path: ROUTES.onboarding_individual_kyc,
      api_key: "kyc",
    },
    {
      title: "Next of KIN",
      description: "Provide your next of kin information",
      id: "next-of-kin",
      path: ROUTES.onboarding_individual_next_of_kin,
      api_key: "next_of_kin",
    },
    {
      title: "Risk Profiling",
      description: "Provide your risk profile information",
      id: "risk-profiling",
      path: ROUTES.onboarding_individual_risk_profiling,
      api_key: "risk_profile",
    },
  ];

  const { basic_info } = useUserStore();
  const { setSteps, markStepComplete, completion_status, setTitle } =
    useOnboardingStore();

  useEffect(() => {
    setSteps(steps);
  }, []);

  useEffect(() => {
    setTitle(
      `Welcome ${basic_info?.first_name || ""} ${
        basic_info?.last_name || ""
      } 👋🏾`
    );
  }, [basic_info]);

  useEffect(() => {
    if (completion_status) {
      steps.forEach((step) => {
        if (completion_status[step.api_key as keyof typeof completion_status]) {
          markStepComplete(step.id);
        }
      });
    }
  }, [completion_status]);

  return children;
};

export default Layout;
