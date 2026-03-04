import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CustomPhoneInput } from "@/components/form/phone-input";
import { SelectInput } from "@/components/form/select-input";
import { genderOptions } from "@/lib/constants";
import { DatePicker } from "@/components/form/date-picker";

const formSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 characters long"),
  first_name: z.string({ required_error: "First name is required" }),
  last_name: z.string({ required_error: "Last name is required" }),
  gender: z.string({ required_error: "Gender is required" }),
  other_names: z.string().optional(),
  dob: z.date({ required_error: "Date of birth is required" }),
});

export type PersonalInfoFormData = z.infer<typeof formSchema>;

interface PersonalInfoFormProps {
  submit: (data: PersonalInfoFormData) => void;
  initData?: PersonalInfoFormData;
  handleBack?: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  submit,
  handleBack,
  initData,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
    control,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (initData) {
      reset(initData);
    }
  }, [initData]);

  const onSubmit: SubmitHandler<PersonalInfoFormData> = (
    data: PersonalInfoFormData
  ) => {
    console.log("Form submitted:", data);
    submit(data);
  };

  return (
    <>
      <form className="space-y-4 flex-row flex-wrap flex justify-between">
        <Input
          label="First name"
          name="first_name"
          placeholder="Enter your first name"
          validatormessage={errors.first_name?.message}
          required
          register={register}
          parentClassName="w-full"
        />
        <Input
          label="Last name"
          name="last_name"
          placeholder="Enter your last name"
          validatormessage={errors.last_name?.message}
          required
          register={register}
          parentClassName="w-full"
        />
        <Input
          label="Other names"
          name="other_names"
          placeholder="Enter your other names"
          validatormessage={errors.other_names?.message}
          register={register}
          parentClassName="w-full"
        />
        <Controller
          name="dob"
          control={control}
          rules={{ required: "Date of birth is required" }}
          render={({ field }) => (
            <DatePicker
              label="Date of birth"
              value={field.value}
              handleChange={(value) => field.onChange(value!)}
              validatormessage={errors.dob?.message}
              required
              parentClassName="w-full"
              placeholder="dd/mm/yyyy"
            />
          )}
        />
        <Controller
          name="gender"
          control={control}
          rules={{ required: "Gender is required" }}
          render={({ field }) => (
            <SelectInput
              label="Gender"
              options={genderOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.gender?.message}
              value={field.value}
              parentClassName="w-full"
            />
          )}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          register={register}
          placeholder="Enter your email address"
          required
          validatormessage={errors.email?.message}
          parentClassName="w-full"
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
          parentClassName="w-full"
        />

        <div className="mt-8 space-y-2 w-full">
          <Button
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
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

export { PersonalInfoForm };
