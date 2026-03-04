import { WarningOctagonIcon } from "@/assets/vectors/icons";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import useOnboardingStore from "@/store/onboarding";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const CompleteOnboardingBanner = () => {
  const router = useRouter();
  const { completion_percentage, completion_status } =
    useOnboardingStore();

  const handleContinue = () => {
    // Logic to continue onboarding
    if (completion_status.personal_info === false) {
      router.push(ROUTES.onboarding_individual_personal);
    } else if (completion_status.bank_info === false) {
      router.push(ROUTES.onboarding_individual_bank);
    } else if (completion_status.kyc === false) {
      router.push(ROUTES.onboarding_individual_kyc);
    } else if (completion_status.next_of_kin === false) {
      router.push(ROUTES.onboarding_individual_next_of_kin);
    } else if (completion_status.risk_profile === false) {
      router.push(ROUTES.onboarding_individual_risk_profiling);
    }
  };

  const isComplete = Object.values(completion_status).every((status) => status === true);

  if (isComplete) return null;

  return (
    <div className="bg-[#FFF3E6] border border-[#FFD8D0] flex items-center sm:items-start rounded-[12px] py-0 px-2 sm:p-2 gap-2">
      <WarningOctagonIcon />
      <div>
        <p className="text-[#592E00] text-p3 sm:text-p2 font-semibold mb-0.5">
          Complete your onboarding
        </p>
        <p className="text-[#733A00] text-p4 hidden sm:block">
          To enjoy the full experience on the Coronation Wealth Hub, you need to complete your
          onboarding
        </p>
      </div>
      <p className="ml-auto sm:my-auto text-l2 text-[11px] text-txt-black bg-bg-warning rounded-[6px] px-2 py-0.5">
        {completion_percentage}%{" "}
        <span className="hidden sm:inline">Complete</span>
      </p>
      <Button
        onClick={handleContinue}
        variant={"ghost"}
        className="!p-0 sm:!p-2 my-auto text-p3 text-txt-primary font-semibold"
        size={"m"}
      >
        <span className="hidden sm:inline">Continue</span> <ChevronRight />{" "}
      </Button>
    </div>
  );
};
