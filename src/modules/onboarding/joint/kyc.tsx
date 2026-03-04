"use client";
import useOnboardingStore from "@/store/onboarding";
import { JSX, useEffect, useState } from "react";
import { FormHeader } from "@/components/form/header";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { KYCForm } from "../_components/kyc-form";
import { JointSteps } from "../_components/joint-steps";

const JointKYCUI: React.FC = () => {
  const router = useRouter();
  const stages = [
    {
      key: "user_1",
      stage: 1,
      title: "User 1",
    },
    { key: "user_2", stage: 2, title: "User 2" },
  ];

  const [stage, setStage] = useState(stages[0]);

  const { markStepComplete, setCurrentStep } = useOnboardingStore();

  useEffect(() => {
    setCurrentStep("kyc");
  }, []);

  const handleSubmit1 = (data: any) => {
    console.log(data);
    setStage(stages[1]);
    window.scrollTo(-0, -0);
  };

  const handleSubmit2 = (data: any) => {
    console.log(data);
    markStepComplete("kyc");
    router.push(ROUTES.onboarding_joint_next_of_kin);
  };

  const StageForms: Record<string, JSX.Element> = {
    user_1: <KYCForm key="bank-info-user-1" submit={handleSubmit1} />,
    user_2: <KYCForm key="bank-info-user-2" submit={handleSubmit2} />,
  };

  return (
    <>
      <FormHeader
        title="KYC"
        description="Help us verify your identity by providing the required documents."
        titleType="h2"
      />
      <JointSteps stages={stages} stage={stage} onChangeStage={setStage} />
      {StageForms[stage.key as keyof typeof StageForms]}
    </>
  );
};

export { JointKYCUI };
