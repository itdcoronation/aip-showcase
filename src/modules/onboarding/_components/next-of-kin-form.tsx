import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CustomPhoneInput } from "@/components/form/phone-input";
import { SelectInput } from "@/components/form/select-input";
import { relationshipOptions } from "@/lib/constants";

const formSchema = z.object({
  fullname: z.string({ required_error: "Full name is required" }),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters long"),
  relationship: z.string({ required_error: "Relationship is required" }),
});

export type NextOfKinFormData = z.infer<typeof formSchema>;

interface NextOfKinFormProps {
  submit: (data: NextOfKinFormData) => void;
  initData?: NextOfKinFormData;
  handleBack?: () => void;
  key?: string;
  isPending?: boolean;
}

const NextOfKinForm: React.FC<NextOfKinFormProps> = ({
  submit,
  handleBack,
  initData,
  key,
  isPending,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
    control,
  } = useForm<NextOfKinFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (initData) {
      reset(initData);
    }
  }, [initData]);

  const onSubmit: SubmitHandler<NextOfKinFormData> = (
    data: NextOfKinFormData
  ) => {
    console.log("Form submitted:", data);
    submit(data);
  };

  return (
    <>
      <form key={key} className="space-y-4">
        <Input
          label="Full name"
          name="fullname"
          placeholder="Enter the name of your next of KIN"
          validatormessage={errors.fullname?.message}
          required
          register={register}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          register={register}
          placeholder="Enter the email of your next of KIN"
          required
          validatormessage={errors.email?.message}
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
        <Controller
          name="relationship"
          control={control}
          rules={{ required: "Relationship is required" }}
          render={({ field }) => (
            <SelectInput
              label="Relationship"
              options={relationshipOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.relationship?.message}
              value={field.value}
              placeholder="How are you related?"
            />
          )}
        />

        <div className="mt-8 space-y-2 w-full">
          <Button
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isPending}
            loading={isPending}
          >
            Save and Continue
          </Button>
          {handleBack ? (
            <Button variant="secondary" className="w-full" onClick={handleBack}>
              Go back
            </Button>
          ) : null}
        </div>
      </form>
    </>
  );
};

export { NextOfKinForm };
