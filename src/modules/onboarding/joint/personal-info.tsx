"use client";
import useOnboardingStore from "@/store/onboarding";
import { JSX, useEffect, useState } from "react";
import { FormHeader } from "@/components/form/header";
import {
  PersonalInfoForm,
  PersonalInfoFormData,
} from "../_components/personal-info-form";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { JointSteps } from "../_components/joint-steps";

const JointPersonalInfoUI: React.FC = () => {
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
  const [user1, setUser1] = useState<PersonalInfoFormData | undefined>(
    undefined
  );
  const [user2, setUser2] = useState<PersonalInfoFormData | undefined>(
    undefined
  );

  const { markStepComplete, setCurrentStep } = useOnboardingStore();

  useEffect(() => {
    setCurrentStep("personal");
  }, []);

  const handleSubmit1 = (data: PersonalInfoFormData) => {
    setUser1(data);
    setStage(stages[1]);
    window.scrollTo(-0, -0);
  };

  const handleSubmit2 = (data: PersonalInfoFormData) => {
    setUser2(data);
    markStepComplete("personal");
    router.push(ROUTES.onboarding_joint_bank);
  };

  const StageForms: Record<string, JSX.Element> = {
    user_1: (
      <PersonalInfoForm
        initData={user1}
        key="personal-info-user-1"
        submit={handleSubmit1}
      />
    ),
    user_2: (
      <PersonalInfoForm
        initData={user2}
        key="personal-info-user-2"
        submit={handleSubmit2}
        handleBack={() => setStage(stages[0])}
      />
    ),
  };

  return (
    <>
      <FormHeader
        title="Personal information"
        description="Tell us a bit about yourself"
        titleType="h2"
      />
      <JointSteps stages={stages} stage={stage} onChangeStage={setStage} />
      {StageForms[stage.key as keyof typeof StageForms]}
    </>
  );
};

export { JointPersonalInfoUI };
