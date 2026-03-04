"use client";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";

const AccountStatementUI = () => {
  const router = useRouter();
  return (
    <div className="py-4 px-3 border border-[#EEEFF1] rounded-md bg-white shadow-sm w-fit max-w-md">
      <p className="text-txt-primary mb-2 font-semibold text-sm">
        Request account statement
      </p>
      <p className="text-txt-tertiary mb-4 text-xs">
        Generate a summary of your account activity for the selected
        period
      </p>
      <Button
        onClick={() => router.push(ROUTES.service_hub_statement_request)}
        size={"xs"}
      >
        Generate account statement
      </Button>
    </div>
  );
};

export { AccountStatementUI };
