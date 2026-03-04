"use client";
import useOnboardingStore from "@/store/onboarding";
import { JSX, useEffect, useState } from "react";
import { FormHeader } from "@/components/form/header";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import {
  NextOfKinForm,
  NextOfKinFormData,
} from "../_components/next-of-kin-form";
import { JointSteps } from "../_components/joint-steps";

const JointNextOfKinUI: React.FC = () => {
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
  const [user1, setUser1] = useState<NextOfKinFormData | undefined>(undefined);
  const [user2, setUser2] = useState<NextOfKinFormData | undefined>(undefined);

  const { markStepComplete, setCurrentStep } = useOnboardingStore();

  useEffect(() => {
    setCurrentStep("next-of-kin");
  }, []);

  const handleSubmit1 = (data: NextOfKinFormData) => {
    setUser1(data);
    setStage(stages[1]);
    window.scrollTo(-0, -0);
  };

  const handleSubmit2 = (data: NextOfKinFormData) => {
    setUser2(data);
    markStepComplete("next-of-kin");
    router.push(ROUTES.onboarding_joint_risk_profiling);
  };

  const StageForms: Record<string, JSX.Element> = {
    user_1: (
      <NextOfKinForm
        initData={user1}
        key="next-of-kin-user-1"
        submit={handleSubmit1}
      />
    ),
    user_2: (
      <NextOfKinForm
        initData={user2}
        key="next-of-kin-user-2"
        submit={handleSubmit2}
        handleBack={() => setStage(stages[0])}
      />
    ),
  };

  return (
    <>
      <FormHeader
        title="Next of KIN"
        description="Kindly provide the details your Next of KIN"
        titleType="h2"
      />
      <JointSteps stages={stages} stage={stage} onChangeStage={setStage} />
      {StageForms[stage.key as keyof typeof StageForms]}
    </>
  );
};

export { JointNextOfKinUI };
