"use client";
import useOnboardingStore from "@/store/onboarding";
import { JSX, useEffect, useState } from "react";
import { FormHeader } from "@/components/form/header";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { BankInfoData, BankInfoForm } from "../_components/bank-info-form";
import { JointSteps } from "../_components/joint-steps";

const JointBankInfoUI: React.FC = () => {
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
  const [user1, setUser1] = useState<BankInfoData[] | undefined>(undefined);
  const [user2, setUser2] = useState<BankInfoData[] | undefined>(undefined);

  const { setCurrentStep, markStepComplete } = useOnboardingStore();

  useEffect(() => {
    setCurrentStep("bank");
  }, []);

  const handleSubmit1 = (data: BankInfoData[]) => {
    setUser1(data);
    setStage(stages[1]);
    window.scrollTo(-0, -0);
  };

  const handleSubmit2 = (data: BankInfoData[]) => {
    setUser2(data);
    markStepComplete("bank");
    router.push(ROUTES.onboarding_joint_kyc);
  };

  const StageForms: Record<string, JSX.Element> = {
    user_1: (
      <BankInfoForm
        initData={user1}
        key="bank-info-user-1"
        submit={handleSubmit1}
      />
    ),
    user_2: (
      <BankInfoForm
        initData={user2}
        key="bank-info-user-2"
        submit={handleSubmit2}
        handleBack={() => setStage(stages[0])}
      />
    ),
  };

  return (
    <>
      <FormHeader
        title="Bank information"
        description="Provide your bank details for seamless transactions."
        titleType="h2"
      />
      <JointSteps stages={stages} stage={stage} onChangeStage={setStage} />
      {StageForms[stage.key as keyof typeof StageForms]}
    </>
  );
};

export { JointBankInfoUI };
