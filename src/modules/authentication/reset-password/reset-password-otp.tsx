"use client";

import { verifyEmailImg } from "@/assets/images";
import { Logo } from "@/assets/vectors";
import { CustomInputOTP } from "@/components/form/input-otp";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { useCountdown } from "@/hooks/useCountdown";

const ResetPasswordOTPUI = () => {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const { canResend, formattedCountdown } = useCountdown(120);

  return (
    <main className="text-center min-h-[100dvh] flex flex-col items-center justify-start py-10 md:py-12 px-4 gap-12">
      <Logo className="mr-auto md:mr-0" />
      <Image
        width={306}
        height={332}
        src={verifyEmailImg}
        alt="envelope with a check mark"
        className="w-[60%] max-w-[300px]"
      />
      <div className="max-w-[360px]">
        <h1 className="text-p1 md:text-h3 font-semibold text-txt-primary mb-2">
          Reset your password
        </h1>
        <p className="text-p4 md:text-p3 text-txt-secondary">
          Enter the code that was sent to the email or phone number you
          previously provided{" "}
        </p>
      </div>
      <>
        <form className="flex flex-col gap-4 items-center justify-center">
          <CustomInputOTP value={otp} onChange={setOtp} />
          {canResend ? (
            <p className="text-p3 text-txt-secondary">
              Didn’t receive the code?{" "}
              <span // onClick={handleResend}
                role="button"
                className="font-medium text-txt-primary"
              >
                Resend
              </span>
            </p>
          ) : (
            <p className="text-center text-p3 font-semibold text-txt-primary">
              {formattedCountdown}
            </p>
          )}
        </form>
        <Button
          onClick={() => router.push(ROUTES.new_password)}
          className="w-full max-w-[360px] mt-auto sm:mt-0"
        >
          Submit
        </Button>
      </>
    </main>
  );
};
export { ResetPasswordOTPUI };
