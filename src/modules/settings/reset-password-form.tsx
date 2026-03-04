"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { NoticeModal } from "@/components/modals/notice-modal";
import { ROUTES } from "@/lib/routes";
import { LockIcon } from "@/assets/vectors/icons";
import { Input } from "@/components/ui/input";
import { OtpModal } from "@/components/modals/otp-modal";
import { useChangePassword } from "@/requests/services/user/change-password";
import { toast } from "sonner";

const formSchema = z
  .object({
    current_password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must include a letter, a number, and a special character"
      ),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must include a letter, a number, and a special character"
      ),
    confirm_new_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords do not match",
    path: ["confirm_new_password"],
  });

type ResetPasswordFormData = z.infer<typeof formSchema>;

export const ResetPasswordFormUI = () => {
  const [show, setShow] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const router = useRouter();
  const { mutate, isPending } = useChangePassword({
    onSuccess: () => {
      setShow(false);
      toast.success("Password changed successfully, please login again");
      router.push(ROUTES.login);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to change password. Please try again."
      );
      console.error("Error changing password:", error);
    },
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ResetPasswordFormData> = (data) => {
    console.log(data);
    mutate({
      current_password: data.current_password,
      new_password: data.new_password,
      new_password_confirmation: data.confirm_new_password,
    });
    // setShowOTP(true);
  };

  return (
    <>
      <OtpModal
        show={showOTP}
        close={() => setShowOTP(false)}
        handleContinue={() => {
          setShowOTP(false);
          setShow(true);
        }}
        title="Confirm password reset"
        continueText="Reset password"
      />
      <NoticeModal
        show={show}
        close={() => setShow(false)}
        description="Your request has been received; you will receive an account statement within 24 hours"
        title="Request received"
        action={{
          text: (
            <>
              Login
              <ChevronRight className="min-w-[20px] !h-[20px]" />
            </>
          ),
          action: () => router.push(ROUTES.login),
        }}
      />
      <section className="px-4 sm:px-6 py-4">
        <header className="mb-8 hidden sm:block">
          <h1 className="text-p1 font-semibold">Account setting</h1>
        </header>
        <Button
          onClick={() => router.push(ROUTES.settings_reset_password)}
          variant={"ghost"}
          size={"sm"}
        >
          <XIcon /> Cancel
        </Button>

        <section className="mx-auto max-w-[940px] mt-4 sm:mt-8">
          <div className="mb-8">
            <h2 className="text-h4 sm:text-h3 font-semibold text-txt-primary mb-1">
              Reset password
            </h2>
            <p className="text-p4 sm:text-p3 text-txt-tertiary">
              Set a new password to access your account
            </p>
          </div>

          <form className="text-sm grid gap-4 sm:gap-8">
            <Input
              startElement={<LockIcon />}
              startOffset="40px"
              label="Enter current password"
              name="current_password"
              type="password"
              placeholder="••••••••••"
              required
              register={register}
              validatormessage={errors.current_password?.message}
            />
            <div className="flex-col sm:flex-row flex gap-4">
              <Input
                startElement={<LockIcon />}
                startOffset="40px"
                label="Enter new password"
                name="new_password"
                type="password"
                placeholder="••••••••••"
                required
                register={register}
                validatormessage={errors.new_password?.message}
                parentClassName="w-full"
                hint="Password must be at least 8 characters and include a letter, a number, and a special character."
              />
              <Input
                startElement={<LockIcon />}
                startOffset="40px"
                label="Re-enter new password"
                name="confirm_new_password"
                type="password"
                placeholder="••••••••••"
                required
                register={register}
                validatormessage={errors.confirm_new_password?.message}
                hint="Password must match"
                parentClassName="w-full"
              />
            </div>

            <Button
              disabled={!isValid || isPending}
              loading={isPending}
              onClick={handleSubmit(onSubmit)}
              className="w-full mt-8 mb-2"
            >
              Send request <ChevronRight />
            </Button>
          </form>
        </section>
      </section>
    </>
  );
};
