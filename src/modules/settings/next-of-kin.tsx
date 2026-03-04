"use client";

import useOnboardingStore from "@/store/onboarding";
import { NextofKinForm } from "./_components/next-of-kin-form";

const NextofKinUI = () => {
  const { data } = useOnboardingStore();

  return (
    <div className="max-w-md">
      <NextofKinForm
        initData={{
          fullname: data?.next_of_kin || "",
          email: data?.next_of_kin_email || "",
          phone: data?.next_of_kin_phone_number || "",
          relationship: data?.next_of_kin_relationship || "",
        }}
      />
    </div>
  );
};

export { NextofKinUI };
