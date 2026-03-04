"use client";
import { ROUTES } from "@/lib/routes";
import { OnboardingStepData } from "@/modules/onboarding/_components/layout";
import useOnboardingStore from "@/store/onboarding";
import { ReactNode, useEffect } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const steps: OnboardingStepData[] = [
    {
      title: "Personal information",
      description: "Personal information",
      id: "personal",
      path: ROUTES.onboarding_joint_personal,
    },
    {
      title: "Bank information",
      description: "Input your bank information",
      id: "bank",
      path: ROUTES.onboarding_joint_bank,
    },
    {
      title: "KYC",
      description: "Provide your kyc Information",
      id: "kyc",
      path: ROUTES.onboarding_joint_kyc,
    },
    {
      title: "Next of KIN",
      description: "Provide your next of kin Information",
      id: "next-of-kin",
      path: ROUTES.onboarding_joint_next_of_kin,
    },
    {
      title: "Risk Profiling",
      description: "Provide your risk profiling Information",
      id: "risk-profiling",
      path: ROUTES.onboarding_joint_risk_profiling,
    },
  ];

  const { setSteps } = useOnboardingStore();

  useEffect(() => {
    setSteps(steps);
  }, []);

  return children;
};

export default Layout;
