import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CustomPhoneInput } from "@/components/form/phone-input";
import { countryOptions } from "@/lib/constants";
import { SelectInput } from "@/components/form/select-input";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  rc_number: z.string().min(5, "BVN must be at least 11 characters long"),
  phone: z.string().min(10, "Phone number must be at least 10 characters long"),
  name: z.string({ required_error: "Last name is required" }),
  office_number: z.string({ required_error: "Office number is required" }),
  street: z.string({ required_error: "Street is required" }),
  city: z.string({ required_error: "City is required" }),
  country: z.string({ required_error: "Country is required" }),
});

export type CompanyInfoFormData = z.infer<typeof formSchema>;

interface CompanyInfoFormProps {
  submit: (data: CompanyInfoFormData) => void;
  initData?: CompanyInfoFormData;
  handleBack?: () => void;
  formId?: string;
  key?: string;
}

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({
  submit,
  handleBack,
  initData,
  key,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
    control,
  } = useForm<CompanyInfoFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (initData) {
      reset(initData);
    } else
      reset({
        rc_number: "RC 123456",
        email: "test@gmail.com",
        phone: "2348179661241",
        name: "Coronation Inc",
      });
  }, [initData]);

  const onSubmit: SubmitHandler<CompanyInfoFormData> = (
    data: CompanyInfoFormData
  ) => {
    console.log("Form submitted:", data);
    submit(data);
  };

  return (
    <>
      <form key={key} className="space-y-4">
        <Input
          label="RC Number"
          name="rc_number"
          placeholder="Enter your bank Verification Number"
          validatormessage={errors.rc_number?.message}
          required
          register={register}
          disabled
        />
        <Input
          label="Company name"
          name="name"
          placeholder="Enter your company name"
          validatormessage={errors.name?.message}
          required
          register={register}
          disabled
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
          disabled
        />
        <Input
          label="Company email"
          name="email"
          type="email"
          register={register}
          placeholder="Enter your email address"
          required
          validatormessage={errors.email?.message}
          disabled
        />
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Country"
              options={countryOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.country?.message}
              value={field.value}
              parentClassName="w-full"
            />
          )}
        />
        <Input
          label="Office number"
          name="office_number"
          placeholder="E.g, 123, 6, 74"
          validatormessage={errors.office_number?.message}
          required
          register={register}
          parentClassName="w-full"
        />
        <Input
          label="Street name"
          name="street"
          placeholder="E.g, Ozumba Mbadiwe"
          validatormessage={errors.street?.message}
          required
          register={register}
          parentClassName="w-full"
        />
        <Input
          label="City"
          name="city"
          placeholder="Enter name of city"
          validatormessage={errors.city?.message}
          required
          register={register}
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

export { CompanyInfoForm };
