"use client";

import { checkImg, verifyEmailImg } from "@/assets/images";
import { Logo } from "@/assets/vectors";
import { CustomInputOTP } from "@/components/form/input-otp";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { useVerifyEmail } from "@/requests/services/auth/verify-email";
import { toast } from "sonner";
import useAuthStore from "@/store/authentication";
import { useResendOTP } from "@/requests/services/auth/resend-otp";
import { useCountdown } from "@/hooks/useCountdown";

const VerifyEmailUI = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Access query parameters
  const joint = searchParams.get("joint");
  const { email } = useAuthStore();

  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const { mutate, isPending } = useVerifyEmail({
    onSuccess: () => {
      setSuccess(true);
      toast.success("Email verified successfully!");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Email verification failed. Please try again."
      );
    },
  });

  const { mutate: mutateResend, isPending: isPendingResend } = useResendOTP({
    onSuccess: () => {
      toast.success("OTP resent successfully!");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Resend OTP failed. Please try again."
      );
    },
  });

  const handleSubmit = () => {
    mutate({
      email,
      otp,
    });
  };

  const handleResend = () => {
    mutateResend({
      email,
    });
  };

  const { canResend, formattedCountdown } = useCountdown(120);

  return (
    <main className="text-center min-h-[100dvh] flex flex-col items-center justify-start py-10 md:py-12 px-4 gap-12">
      <Logo className="mr-auto md:mr-0" />
      <Image
        width={306}
        height={332}
        src={success ? checkImg : verifyEmailImg}
        alt="envelope with a check mark"
        className="w-[60%] max-w-[300px]"
      />
      <div className="max-w-[360px]">
        <h1 className="text-p1 md:text-h3 font-semibold text-txt-primary mb-2">
          {success
            ? "Hurray! 🎉"
            : joint
            ? `Confirm email for user ${step}`
            : "Confirm your email"}
        </h1>
        <p className="text-p4 md:text-p3 text-txt-secondary">
          {success
            ? "You have successfully confirmed your email address"
            : "Enter the code that was sent to the email or phone number you previously provided."}
        </p>
      </div>
      {success ? (
        <Button
          onClick={() => {
            if ((joint && step === 2) || !joint) {
              router.push(ROUTES.login);
            } else {
              setStep(2);
              setSuccess(false);
            }
          }}
          className="w-full max-w-[360px] mt-auto sm:mt-0"
        >
          {(joint && step === 2) || !joint
            ? "Continue to login"
            : "Confirm email for user 2"}
        </Button>
      ) : (
        <>
          <form className="flex flex-col gap-4 items-center justify-center">
            <CustomInputOTP value={otp} onChange={setOtp} />
            {!canResend ? (
              <p className="text-center text-p3 font-semibold text-txt-primary">
                {formattedCountdown}
              </p>
            ) : (
              <p className="text-p3 text-txt-secondary">
                Didn’t receive the code?{" "}
                <span
                  onClick={handleResend}
                  role="button"
                  className="font-medium text-txt-primary"
                >
                  {isPendingResend ? "Resending..." : "Resend"}
                </span>
              </p>
            )}
          </form>
          <Button
            disabled={otp.length < 6 || isPending}
            onClick={handleSubmit}
            className="w-full max-w-[360px] mt-auto sm:mt-0"
          >
            Submit
          </Button>
        </>
      )}
    </main>
  );
};
export { VerifyEmailUI };
