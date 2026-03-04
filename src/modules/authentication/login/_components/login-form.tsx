import { LockIcon, UserCircleIcon } from "@/assets/vectors/icons";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { FormHeader } from "@/components/form/header";
import { useLogin } from "@/requests/services/auth/login";
import { toast } from "sonner";
import { useFetchOnboardingStatus } from "@/requests/services/onboarding/status";
import useAuthStore from "@/store/authentication";
import { clearTokens } from "@/requests/token";
import { useResendOTP } from "@/requests/services/auth/resend-otp";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must include a letter, a number, and a special character"
    ),
});

type LoginFormData = z.infer<typeof formSchema>;

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  // Mutation to initiate or retrieve onboarding
  const {
    mutate: mutateInitiateOnboarding,
    isPending: isPendingInitiateOnboarding,
  } = useFetchOnboardingStatus({
    onSuccess: (data) => {
      // Redirect based on completion status
      if (
        data.data.completion_status.status === "draft" &&
        !data.data.completion_status.personal_info
      ) {
        router.push(ROUTES.onboarding_individual_personal);
      } else {
        router.push(ROUTES.overview);
      }
    },
    onError: (error) => {
      console.error("Error initiating onboarding:", error);
      toast.error(
        error?.response?.data?.message ??
          "Failed to initiate onboarding. Please try again."
      );
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setEmail: setEmailInStore } = useAuthStore();

  const { mutate: mutateResend, isPending: isPendingResend } = useResendOTP({
    onSuccess: () => {
      toast.success("Please verify your email to continue.");
      router.push(ROUTES.verify_email);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Resend OTP failed. Please try again."
      );
    },
  });

  const { mutate: mutateLogin, isPending } = useLogin({
    onSuccess: (data) => {
      toast.success("Login successful!");
      if (!data.is_email_confirmed) {
        setEmailInStore(email);
        mutateResend({ email }); // Resend OTP on login if email not confirmed
        return;
      }
      if (!data.is_password_reset) {
        toast.success("Please reset your password to continue.");
        router.push(ROUTES.settings_reset_password_form);
        return;
      }
      if (data.is_profile_complete) {
        router.push(ROUTES.overview);
        return;
      }
      mutateInitiateOnboarding({ user_id: email }); // initiate onboarding or retrieve onboarding on successful login
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ??
          "Login failed. Please check your credentials."
      );
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<LoginFormData> = (data: LoginFormData) => {
    setEmail(data.email);
    localStorage.clear();
    clearTokens();
    mutateLogin({ email: data.email, password: data.password });
  };

  return (
    <>
      <div className="md:max-w-[450px] m-auto px-4 w-full">
        <FormHeader
          title="Login"
          description="Centralized login for all user types"
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
          <Input
            startElement={<LockIcon />}
            startOffset="40px"
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••••"
            required
            register={register}
            validatormessage={errors.password?.message}
          />
          <Link
            className="text-p3 font-semibold text-txt-primary"
            href={ROUTES.forgot_password}
          >
            Forgot password?
          </Link>
          <Button
            className="w-full mt-8"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isPending || isPendingInitiateOnboarding ||isPendingResend}
            loading={isPending || isPendingResend}
          >
            Login
          </Button>
        </form>
        <p className="text-p3 text-txt-secondary mt-8 text-center">
          Don’t have an account with us yet?{" "}
          <Link
            href={ROUTES.signup}
            className="font-medium text-txt-brand-dark"
          >
            Sign up
          </Link>
        </p>
        <p className="text-xs text-center text-txt-secondary mt-8">
          Coronation Group Limited is registered as Capital Market Holding
          Company and regulated by the Securities and Exchange Commission,
          Nigeria
        </p>
      </div>
    </>
  );
};

export { LoginForm };
