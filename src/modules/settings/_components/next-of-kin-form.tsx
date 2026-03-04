import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomPhoneInput } from "@/components/form/phone-input";
import { SelectInput } from "@/components/form/select-input";
import { relationshipOptions } from "@/lib/constants";

const formSchema = z.object({
  fullname: z.string({ required_error: "Full name is required" }),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters long"),
  relationship: z.string({ required_error: "Relationship is required" }),
});

export type NextofKinFormData = z.infer<typeof formSchema>;

interface NextofKinFormProps {
  initData?: NextofKinFormData;
}

const NextofKinForm: React.FC<NextofKinFormProps> = ({ initData }) => {
  const {
    register,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
  } = useForm<NextofKinFormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (initData) {
      reset(initData);
    }
  }, [initData]);

  return (
    <>
      <form className="space-y-4 flex-col flex-wrap flex justify-between">
        <Input
          label="Full name"
          name="fullname"
          placeholder="Enter the name of your next of KIN"
          validatormessage={errors.fullname?.message}
          required
          register={register}
          disabled
        />
        <Input
          label="Email"
          name="email"
          type="email"
          register={register}
          placeholder="Enter the email of your next of KIN"
          required
          validatormessage={errors.email?.message}
          disabled
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
          disabled
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
              disabled
            />
          )}
        />
      </form>
    </>
  );
};

export { NextofKinForm };
