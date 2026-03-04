"use client";
import { Dashboard } from "./dashboard";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useModalContext } from "@/context/modal-context";

const OverviewUI = () => {
  const searchParams = useSearchParams();
  const feedback = searchParams.get("feedback");
  const { handleFeedbackState } = useModalContext();

  useEffect(() => {
    if (feedback === "true") {
      handleFeedbackState({
        showFeedback: true,
        description: "How was your onboarding experience?",
      });
    }
  }, [feedback]);

  return (
    <>
      <Dashboard />
      {/* <TransactionHistory /> */}
    </>
  );
};

export { OverviewUI };
