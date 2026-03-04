import {
  BuildingsIcon,
  LockIcon,
  UserCircleIcon,
} from "@/assets/vectors/icons";
import { Input } from "@/components/ui/input";
import React from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CustomPhoneInput } from "@/components/form/phone-input";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { FormHeader } from "@/components/form/header";

const formSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    rc_number: z.string().min(1, "Required"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must include a letter, a number, and a special character"
      ),
    confirm_password: z.string(),
    referral_code: z.string().optional(),
    terms_accepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type InstitutionSignupFormData = z.infer<typeof formSchema>;

const InstitutionSignupForm: React.FC = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm<InstitutionSignupFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      rc_number: "",
      phone: "",
      password: "",
      confirm_password: "",
      referral_code: "",
      terms_accepted: false,
    },
  });

  const onSubmit: SubmitHandler<InstitutionSignupFormData> = (
    data: InstitutionSignupFormData
  ) => {
    console.log("Form submitted:", data);
    router.push(ROUTES.verify_email);
  };

  return (
    <>
      <div className="md:max-w-[450px] mx-auto md:px-4">
        <FormHeader
          title="Institutional/Corporate investor"
          description="A short description about an institution/corporate investor"
          titleType="h2"
        />
        <form className="space-y-4">
          <Input
            startElement={<UserCircleIcon />}
            startOffset="40px"
            label="Company Email"
            name="email"
            type="email"
            register={register}
            placeholder="Enter your company email address"
            required
            validatormessage={errors.email?.message}
          />
          <Input
            startElement={<BuildingsIcon />}
            startOffset="40px"
            label="RC Number"
            name="rc_number"
            placeholder="Enter your company RC Number"
            validatormessage={errors.rc_number?.message}
            required
            register={register}
          />
          <CustomPhoneInput
            label="Company phone number"
            name="phone"
            placeholder="+1 (555) 000-0000"
            validatormessage={errors.phone?.message}
            required
            onChange={(phone) => {
              setValue("phone", phone);
            }}
            value={watch("phone")}
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
            hint="Password must be at least 8 characters and include a letter, a number, and a special character."
          />
          <Input
            startElement={<LockIcon />}
            startOffset="40px"
            label="Re-enter password"
            name="confirm_password"
            type="password"
            placeholder="••••••••••"
            required
            register={register}
            validatormessage={errors.confirm_password?.message}
            hint="Password must match"
          />
          <Input
            label="Referral code (Optional)"
            name="referral_code"
            placeholder="Enter a referral code"
            required
            register={register}
            validatormessage={errors.referral_code?.message}
            hint="Password must match"
          />
          <div>
            <div className="grid grid-cols-[20px_1fr] gap-2">
              <Checkbox
                className="w-[20px] h-[20px] rounded-[6px]"
                checked={watch("terms_accepted")}
                onCheckedChange={(checked) => {
                  setValue("terms_accepted", checked as boolean);
                }}
                id="terms_accepted"
                name="terms_accepted"
              />
              <p className="text-p3 font-medium text-txt-secondary">
                Clicking on the checkbox, you confirm that you agree to{" "}
                <Link className="text-txt-brand-dark font-semibold" href="">
                  Terms of service
                </Link>{" "}
                and{" "}
                <Link className="text-txt-brand-dark font-semibold" href="">
                  Privacy policy
                </Link>
              </p>
            </div>
            {errors.terms_accepted && (
              <small className="text-txt-danger !text-p3 mt-1">
                {errors.terms_accepted.message}
              </small>
            )}
          </div>

          <Button
            className="w-full mt-8"
            onClick={handleSubmit(onSubmit)}
            // disabled={!isValid || isSubmitting}
          >
            Sign up
          </Button>
          <p className="text-xs text-center text-txt-secondary mt-4">
            Coronation Group Limited is registered as Capital Market Holding
            Company and regulated by the Securities and Exchange Commission,
            Nigeria
          </p>
        </form>
      </div>
    </>
  );
};

export { InstitutionSignupForm };
