"use client";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";

const ResetPasswordUI = () => {
  const router = useRouter();
  return (
    <div className="py-4 px-3 border border-[#EEEFF1] rounded-md bg-white shadow-sm w-full max-w-md">
      <p className="text-txt-primary mb-2 font-semibold text-sm">
        Reset password
      </p>
      <p className="text-txt-tertiary mb-4 text-xs">
        Set a new password to access your account
      </p>
      <Button
        onClick={() => router.push(ROUTES.settings_reset_password_form)}
        size={"xs"}
      >
        Reset
      </Button>
    </div>
  );
};

export { ResetPasswordUI };
