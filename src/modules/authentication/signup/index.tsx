"use client";
import React, { JSX, useEffect, useState } from "react";
import {
  Logo,
  IndividualSvg,
  InstitutionSvg,
  JointSvg,
} from "@/assets/vectors";
import { cn } from "@/lib/utils";
import { ArrowBendUpLeft, CheckCircleIcon } from "@/assets/vectors/icons";
import { IndividualSignupForm } from "./_components/individual-signup-form";
import { InstitutionSignupForm } from "./_components/institution-signup-form";
import { JointSignupForm } from "./_components/joint-signup-form";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import { Button } from "@/components/ui/button";

const SignupUI: React.FC = () => {
  const [type, setType] = useState("");

  const { isMobile } = useDeviceSize(768);

  const accountTypes: CardData[] = [
    {
      key: "individual",
      title: "Individual investor",
      description:
        "A single person investing their own money for personal financial goals",
      icon: <IndividualSvg />,
    },
    {
      key: "institution",
      title: "Institutional/Corporate investor",
      description:
        "Company or organization (like a bank, law firm, or corporation) that invests large sums on behalf of its stakeholders.",
      icon: <InstitutionSvg />,
    },
    {
      key: "joint",
      title: "Joint investor",
      description:
        "Two individuals investing together, sharing ownership and responsibility for the investment (e.g., spouses )",
      icon: <JointSvg />,
    },
  ];

  useEffect(() => {
    setType(isMobile ? "" : "individual");
  }, [isMobile]);

  const formTypes: Record<string, JSX.Element> = {
    individual: <IndividualSignupForm />,
    institution: <InstitutionSignupForm />,
    joint: <JointSignupForm />,
  };
  return (
    <main className="grid p-3 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.05fr_1.5fr] min-h-[100dvh] gap-4">
      {!isMobile || (isMobile && !type) ? (
        <section
          className={
            "bg-[#F8F2FA] rounded-lg px-4 md:px-6 lg:px-12 py-6 md:py-8 bg-[url('/coins.png')] bg-no-repeat bg-[position:bottom_left] md:min-h-[900px] bg-size-[50%] sm:bg-size-[40%] lg:bg-size-auto"
          }
        >
          <Logo className="mb-14" />
          <h1 className="text-h4 font-semibold mb-2 text-txt-primary">
            Get started
          </h1>
          <p className="text-p3 font-medium mb-8 md:mb-12 text-txt-secondary">
            Whether you&apos;re building wealth, planning for the future, or
            diversifying your portfolio, we&apos;ve got you covered.
          </p>
          <div className="grid gap-4">
            {accountTypes.map((account) => (
              <Card
                {...account}
                key={account.key}
                isSelected={account.key === type}
                onClick={() => setType(account.key)}
              />
            ))}
          </div>
          <p className="text-p3 text-txt-secondary mt-8">
            Already have an account?{" "}
            <Link
              href={ROUTES.login}
              className="font-medium text-txt-brand-dark"
            >
              Login
            </Link>
          </p>
        </section>
      ) : null}
      {!isMobile || (isMobile && !!type) ? (
        <section className="py-8 sm:py-10">
          {isMobile ? (
            <Button
              variant={"outline"}
              size={"sm"}
              className="px-2 h-[30px] mb-6"
              onClick={() => setType("")}
            >
              <ArrowBendUpLeft /> Go back
            </Button>
          ) : null}
          {formTypes[type]}
        </section>
      ) : null}
    </main>
  );
};

interface CardData {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface CardProps extends CardData {
  onClick: () => void;
  isSelected: boolean;
}

const Card = ({
  title,
  description,
  icon,
  onClick,
  isSelected,
}: CardProps) => {
  return (
    <div
      role="button"
      onClick={onClick}
      tabIndex={0}
      className={cn(
        "relative bg-white rounded-lg p-3 border grid grid-cols-[40px_1fr_20px] gap-2 cursor-pointer",
        isSelected ? "border-stroke-brand" : "border-stroke-primary"
      )}
    >
      {icon}
      <div>
        <p className="text-p2 md:text-p1 font-semibold text-txt-primary">
          {title}
        </p>
        <p className="text-p4 md:text-p3 text-txt-secondary">{description} </p>
      </div>
      {isSelected ? (
        <CheckCircleIcon />
      ) : (
        <span className="w-[20px] h-[20px] rounded-full border border-3 border-bg-secondary"></span>
      )}{" "}
    </div>
  );
};

export { SignupUI };
