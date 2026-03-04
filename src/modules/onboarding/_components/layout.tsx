"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { DashedLine, Logo } from "@/assets/vectors";

import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { Label } from "@//components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import useOnboardingStore from "@/store/onboarding";
import { useRouter } from "next/navigation";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import { ArrowBendUpLeft, CheckCircleIcon } from "@/assets/vectors/icons";
import { Button } from "@/components/ui/button";
import isAuth from "@/lib/auth-guard";

const OnboardingLayout = ({ children }: { children: ReactNode }) => {
  const [view, setView] = useState(1);

  const {
    steps,
    completedSteps,
    currentStep,
    setCurrentStep,
    title,
    description,
    isOnboarded,
  } = useOnboardingStore();
  const stepNumber = steps.findIndex((step) => step.id === currentStep) + 1;
  const router = useRouter();
  const { isMobile } = useDeviceSize(768);

  useEffect(() => {
    if (isMobile) setView(1);
  }, [isMobile]);

  return (
    <main className="grid p-3 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.05fr_1.5fr] min-h-[100dvh] gap-4">
      {!isMobile || (isMobile && view === 1) ? (
        <section
          className={
            "bg-[#F8F2FA] rounded-lg px-4 md:px-6 lg:px-12 py-6 md:py-8 bg-[url('/coins.png')] bg-no-repeat bg-[position:bottom_left] min-h-[800px] md:min-h-[1000px] bg-size-[50%] sm:bg-size-[40%] lg:bg-size-auto"
          }
        >
          <Logo className="mb-14" />
          <h1 className="text-h4 font-semibold mb-2 text-txt-primary">
            {title}
          </h1>
          <p className="text-p3 font-medium mb-8 md:mb-12 text-txt-secondary">
            {description}
          </p>
          <div className="grid gap-4">
            <RadioGroup
              value={currentStep}
              defaultValue={currentStep}
              onValueChange={(value) => setCurrentStep(value)} // Update currentStep on change
            >
              {steps.map((step, index) => {
                const isComplete = completedSteps.some(
                  (item) => item === step.id
                );
                const isActive = currentStep === step.id;
                return (
                  <div key={step.id}>
                    <Step
                      {...step}
                      isComplete={isComplete}
                      isActive={isActive || isComplete}
                      onClick={() => {
                        router.push(step.path);
                        setView(2);
                      }}
                    />
                    {index === steps.length - 1 ? null : (
                      <DashedLine className="ml-[7px] h-[32px] md:h-auto" />
                    )}
                  </div>
                );
              })}
            </RadioGroup>
          </div>
          <p className="text-p3 text-txt-secondary mt-8">
            {isOnboarded ? "Not ready yet?" : "Skip this process?"}{" "}
            <Link
              href={ROUTES.overview}
              className="font-medium text-txt-brand-dark"
            >
              {isOnboarded ? "Go back to dashboard" : "Continue to dashboard"}
            </Link>
          </p>
        </section>
      ) : null}
      {!isMobile || (isMobile && view === 2) ? (
        <section className="max-w-[450px] mx-auto py-8 sm:py-10 md:px-4 w-full">
          {isMobile ? (
            <Button
              variant={"outline"}
              size={"sm"}
              className="px-2 h-[30px] mb-6"
              onClick={() => setView(1)}
            >
              <ArrowBendUpLeft /> Go back
            </Button>
          ) : null}

          <p className="text-p3 mb-4 text-stroke-success">
            Step {stepNumber} of {steps.length}
          </p>
          {children}
        </section>
      ) : null}
    </main>
  );
};

export interface OnboardingStepData {
  id: string;
  title: string;
  description: string;
  path: string;
  api_key?: string;
}

export interface OnboardingStepProps extends OnboardingStepData {
  isComplete: boolean;
  isActive: boolean;
  onClick: () => void;
}

const Step = ({
  isActive,
  title,
  description,
  id,
  onClick,
  isComplete,
}: OnboardingStepProps) => {
  return (
    <div
      className={cn(
        "flex items-start space-x-3",
        !isActive ? "opacity-54" : ""
      )}
    >
      {isComplete ? (
        <CheckCircleIcon role="button" onClick={onClick} />
      ) : (
        <RadioGroupItem
          onClick={onClick}
          disabled={!isActive}
          value={id}
          id={id}
        />
      )}
      <div>
        <Label
          aria-disabled={!isActive}
          className="text-txt-primary text-p3 font-medium mb-2"
          htmlFor={id}
        >
          {title}
        </Label>
        <p className="text-txt-secondary text-l3">{description}</p>
      </div>
    </div>
  );
};

export default isAuth(OnboardingLayout);
