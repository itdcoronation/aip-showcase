import { LockIcon } from "@/assets/vectors/icons";
import { Input } from "@/components/ui/input";
import React from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { FormHeader } from "@/components/form/header";
import { ChevronLeft } from "lucide-react";
import { useResetPassword } from "@/requests/services/auth";
import { toast } from "sonner";
import { useExtractUrlFragments } from "@/hooks/useExtractUrlFragments";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must include a letter, a number, and a special character"
      ),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type NewPasswordFormData = z.infer<typeof formSchema>;

const NewPasswordForm: React.FC = () => {
  const router = useRouter();
  const { token, callback } = useExtractUrlFragments();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const { mutate, isPending } = useResetPassword({
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successful!");
      router.push(ROUTES.login);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    },
  });

  const onSubmit: SubmitHandler<NewPasswordFormData> = (
    data: NewPasswordFormData
  ) => {
    if (token && callback)
      mutate({
        email: callback,
        new_password: data.password,
        new_password_confirmation: data.confirm_password,
        token,
      });
    else toast.error("Invalid or missing token/callback. Please try again.");
  };

  return (
    <>
      <div className="md:max-w-[450px] m-auto px-4 w-full">
        <FormHeader
          title="Reset your password"
          description="Enter a unique password"
          titleType="h1"
        />
        <form className="space-y-4">
          <Input
            startElement={<LockIcon />}
            startOffset="40px"
            label="Enter new password"
            name="password"
            type="password"
            placeholder="••••••••••"
            required
            register={register}
            validatormessage={errors.password?.message}
          />
          <Input
            startElement={<LockIcon />}
            startOffset="40px"
            label="Re-enter new password"
            name="confirm_password"
            type="password"
            placeholder="••••••••••"
            required
            register={register}
            validatormessage={errors.confirm_password?.message}
          />

          <Button
            className="w-full mt-8"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            loading={isPending}
          >
            Reset password
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

export { NewPasswordForm };
