import { KeyIcon, LockIcon, UserCircleIcon } from "@/assets/vectors/icons";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, JSX } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CustomPhoneInput } from "@/components/form/phone-input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

const JointSignupForm: React.FC = () => {
  const router = useRouter();
  const stages = [
    {
      key: "user_1",
      stage: 1,
      title: "User 1",
    },
    { key: "user_2", stage: 2, title: "User 2" },
    { key: "security", stage: 3, title: "Security information" },
  ];

  const [stage, setStage] = useState(stages[0]);
  const [user1, setUser1] = useState<UserFormData | undefined>(undefined);
  const [user2, setUser2] = useState<UserFormData | undefined>(undefined);
  const [securityData, setSecurityData] = useState<
    SecurityFormData | undefined
  >(undefined);

  const handleUser1Submit = (data: UserFormData) => {
    setUser1(data);
    setStage(stages[1]);
  };
  const handleUser2Submit = (data: UserFormData) => {
    setUser2(data);
    setStage(stages[2]);
  };
  const handleSecuritySubmit = (data: SecurityFormData) => {
    setSecurityData(data);
    // Handle final submission or any other logic here
    router.push(`${ROUTES.verify_email}?joint=true`);
  };

  const StageForms: Record<string, JSX.Element> = {
    user_1: (
      <UserForm key="user_1" initData={user1} submit={handleUser1Submit} />
    ),
    user_2: (
      <UserForm
        key="user_2"
        initData={user2}
        submit={handleUser2Submit}
        handleBack={() => setStage(stages[0])}
      />
    ),
    security: (
      <SecurityForm
        initData={securityData}
        submit={handleSecuritySubmit}
        handleBack={() => setStage(stages[1])}
      />
    ),
  };

  return (
    <>
      <div className="md:max-w-[450px] mx-auto md:px-4">
        <h2 className="text-p1 md:text-h3 font-semibold mb-2 text-txt-primary">
          Joint investor
        </h2>
        <p className="text-p3 font-medium mb-4 md:mb-10 text-txt-secondary">
          A short description about a joint investor
        </p>
        <div className="border-y border-stroke-primary flex gap-4 mb-6 md:mb-10">
          {stages.map((item) => (
            <span
              onClick={() => setStage(item)}
              key={item.key}
              className={cn(
                "py-4 block text-txt-tertiary !text-p4 md:!text-p3 -mb-[1px] border-b",
                stage.stage === item.stage
                  ? "text-txt-primary !border-stroke-inv"
                  : "!border-transparent"
              )}
            >
              {item.title}
            </span>
          ))}
        </div>
        {StageForms[stage.key as keyof typeof StageForms]}
      </div>
    </>
  );
};

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  bvn: z.string().min(11, "BVN must be at least 11 characters long"),
  phone: z.string().min(10, "Phone number must be at least 10 characters long"),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  initData: UserFormData | undefined;
  submit: (data: UserFormData) => void;
  handleBack?: () => void;
  key: string;
}

const UserForm: React.FC<UserFormProps> = ({
  handleBack,
  initData,
  submit,
  key,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: initData ?? {
      email: "",
      bvn: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (initData) {
      reset(initData);
    }
  }, [initData, reset]);

  const onSubmit: SubmitHandler<UserFormData> = (data) => {
    console.log("Form submitted:", data);
    submit(data);
  };
  return (
    <>
      <form key={key} className="space-y-4">
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
          startElement={<KeyIcon />}
          startOffset="40px"
          label="BVN"
          name="bvn"
          placeholder="Enter your bank Verification Number"
          validatormessage={errors.bvn?.message}
          required
          register={register}
        />
        <CustomPhoneInput
          label="Phone number"
          name="phone"
          placeholder="+1 (555) 000-0000"
          validatormessage={errors.phone?.message}
          required
          onChange={(phone) => {
            setValue("phone", phone);
          }}
          value={watch("phone")}
        />
        <div className="mt-8 space-y-2">
          <Button
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            // disabled={!isValid || isSubmitting}
          >
            Next
          </Button>
          {handleBack ? (
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleBack}
              // disabled={!isValid || isSubmitting}
            >
              Go back
            </Button>
          ) : null}
        </div>
      </form>
    </>
  );
};

const securitySchema = z
  .object({
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

type SecurityFormData = z.infer<typeof securitySchema>;

interface SecurityFormProps {
  handleBack: () => void;
  submit: (data: SecurityFormData) => void;
  initData: SecurityFormData | undefined;
}

const SecurityForm: React.FC<SecurityFormProps> = ({
  handleBack,
  initData,
  submit,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    mode: "onChange",
    defaultValues: initData ?? {
      password: "",
      confirm_password: "",
      referral_code: "",
      terms_accepted: false,
    },
  });

  useEffect(() => {
    if (initData) {
      reset(initData);
    }
  }, [initData, reset]);

  const onSubmit: SubmitHandler<SecurityFormData> = (data) => {
    console.log("Form submitted:", data);
    submit(data);
  };

  return (
    <>
      <form className="space-y-4">
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

        <div className="mt-8 space-y-2">
          <Button
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            // disabled={!isValid || isSubmitting}
          >
            Sign up
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleBack}
            // disabled={!isValid || isSubmitting}
          >
            Go back
          </Button>
        </div>
        <p className="text-xs text-center text-txt-secondary mt-4">
          Coronation Group Limited is registered as Capital Market Holding
          Company and regulated by the Securities and Exchange Commission,
          Nigeria
        </p>
      </form>
    </>
  );
};

export { JointSignupForm };
