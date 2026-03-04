"use client";
import { ROUTES } from "@/lib/routes";
import { OnboardingStepData } from "@/modules/onboarding/_components/layout";
import useOnboardingStore from "@/store/onboarding";
import { ReactNode, useEffect } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const steps: OnboardingStepData[] = [
    {
      title: "Minor’s personal information",
      description: "Personal information",
      id: "personal",
      path: ROUTES.onboarding_minor_account_personal,
    },
    {
      title: "Minor’s KYC",
      description: "Upload minor's KYC documents",
      id: "kyc",
      path: ROUTES.onboarding_minor_account_kyc,
    },
  ];

  const { setSteps, setTitle, setDescription, setIsOnboarded } =
    useOnboardingStore();

  useEffect(() => {
    setTitle("Add an account for your ward");
    setDescription("Complete this step to create a minor's account.");
    setSteps(steps);
    setIsOnboarded(true);
  }, []);

  return children;
};

export default Layout;
