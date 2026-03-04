import { UserCircleIcon } from "@/assets/vectors/icons";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { FormHeader } from "@/components/form/header";
import { ChevronLeft } from "lucide-react";
import { NoticeModal } from "@/components/modals/notice-modal";
import { useForgotPassword } from "@/requests/services/auth";
import { toast } from "sonner";
import { forgotPasswordResponse } from "@/types/auth";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof formSchema>;

const ForgotPasswordForm: React.FC = () => {
  const [show, setShow] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSuccess = (data: forgotPasswordResponse) => {
    console.log("Forgot password request successful:", data);
    reset();
    setShow(true);
  };

  const onError = (error: any) => {
    console.error("Forgot password request error:", error);
    // You can show an error message to the user
    toast.error(
      error?.response?.data?.message ||
        "Failed to send password reset email. Please try again."
    );
  };

  const { mutate, isPending } = useForgotPassword({ onSuccess, onError });

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = (
    data: ForgotPasswordFormData
  ) => {
    mutate({ email: data.email, callback: data.email });
  };

  return (
    <>
      <NoticeModal
        title={"Check your mail"}
        description={
          "We have sent you instructions on how to reset your password"
        }
        close={() => setShow(false)}
        show={show}
        type="success"
        action={{
          text: "Close",
          action: () => setShow(false),
          className: "!bg-bg-secondary !text-txt-primary mt-4",
        }}
      />
      <div className="md:max-w-[450px] m-auto px-4 w-full">
        <FormHeader
          title="Almost there!"
          description="Please enter your registered email address. We will securely send a confirmation message to your inbox."
          titleType="h1"
        />
        <form className="space-y-4">
          <Input
            startElement={<UserCircleIcon />}
            startOffset="40px"
            label="Email"
            name="email"
            type="email"
            register={register}
            placeholder="Enter your email address"
            required
            validatormessage={errors.email?.message}
          />

          <Button
            className="w-full mt-8"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            loading={isPending}
          >
            Request password reset
          </Button>
        </form>
        <p className="text-p3 text-txt-secondary mt-8 text-center w-fit mx-auto flex items-center gap-1">
          <ChevronLeft
            color="#B5B6BA"
            width={18}
            height={18}
            strokeWidth={1.5}
          />
          Back to{" "}
          <Link href={ROUTES.login} className="font-medium text-txt-brand-dark">
            Login
          </Link>
        </p>
      </div>
    </>
  );
};

export { ForgotPasswordForm };
