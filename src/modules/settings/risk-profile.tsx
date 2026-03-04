"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { RiskProfileForm } from "./_components/risk-profile-form";
import { NoticeModal } from "@/components/modals/notice-modal";
import { useState } from "react";
import useUserStore from "@/store/user";
import { riskAnswerMapping } from "@/types/risk-profile";

const RiskProfileUI = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updated = searchParams.get("updated");
  const { risk_profile } = useUserStore();

  const [showModal, setShowModal] = useState(!!updated);

  return (
    <div className="max-w-md">
      {!!risk_profile.risk_category ? (
        <div className="py-4 px-3 border border-[#EEEFF1] rounded-md bg-white shadow-sm w-fit max-w-md mb-6">
          <p className="text-txt-primary mb-2 font-semibold text-sm flex items-center gap-2">
            You are currently{" "}
            <span className="text-xs bg-bg-brand-light text-txt-brand p-1 rounded-[6px] font-normal">
              {risk_profile.risk_category}
            </span>
          </p>

          <p className="text-txt-tertiary mb-4 text-xs">
            Help us understand your risk tolerance to recommend suitable
            investment options aligned with your financial goals.
          </p>
          <Button
            onClick={() =>
              router.push(
                `${ROUTES.onboarding_individual_risk_profiling}?retake=true`
              )
            }
            size={"xs"}
          >
            Retake risk questionnaire
          </Button>
        </div>
      ) : null}

      <RiskProfileForm
        initData={{
          employment_status:
            risk_profile.risk_answers?.[riskAnswerMapping.employment_status] ||
            "",
          income_range:
            risk_profile.risk_answers?.[riskAnswerMapping.income_range] || "",
          investment_percent:
            risk_profile.risk_answers?.[riskAnswerMapping.investment_percent] ||
            "",
          investment_experience:
            risk_profile.risk_answers?.[
              riskAnswerMapping.investment_experience
            ] || "",
          withdrawal:
            risk_profile.risk_answers?.[riskAnswerMapping.withdrawal] || "",
          goal: risk_profile.risk_answers?.[riskAnswerMapping.goal] || "",
          portfolio:
            risk_profile.risk_answers?.[riskAnswerMapping.portfolio] || "",
        }}
      />
      <NoticeModal
        title={`You are a/an ${risk_profile.risk_category} investor`}
        description={""}
        close={() => {
          setShowModal(false);
          router.replace(ROUTES.settings_risk_profile);
        }}
        show={showModal}
        action={{
          text: "Close",
          action: () => {
            setShowModal(false);
            router.replace(ROUTES.settings_risk_profile);
          },
          className: "!bg-bg-secondary !text-txt-primary",
        }}
      />
    </div>
  );
};

export { RiskProfileUI };
