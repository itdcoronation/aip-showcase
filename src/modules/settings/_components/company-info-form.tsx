import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomPhoneInput } from "@/components/form/phone-input";
import { FileUpload } from "@/components/form/file-upload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { imgSchema } from "@/lib/file";
import { countryOptions } from "@/lib/constants";
import { SelectInput } from "@/components/form/select-input";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  rc_number: z.string().min(5, "BVN must be at least 11 characters long"),
  phone: z.string().min(10, "Phone number must be at least 10 characters long"),
  name: z.string({ required_error: "Last name is required" }),
  avatar: imgSchema,
  office_number: z.string({ required_error: "Office number is required" }),
  street: z.string({ required_error: "Street is required" }),
  city: z.string({ required_error: "City is required" }),
  country: z.string({ required_error: "Country is required" }),
});

export type CompanyInfoFormData = z.infer<typeof formSchema>;

interface CompanyInfoFormProps {
  initData?: CompanyInfoFormData;
  formId?: string;
}

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({
  initData,
  formId,
}) => {
  const {
    register,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
  } = useForm<CompanyInfoFormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (initData) {
      reset(initData);
    }
  }, [initData]);

  return (
    <>
      <form
        key={formId}
        className="space-y-4 flex-col flex-wrap flex justify-between"
      >
        <section className="flex items-center gap-4 mb-8 w-full">
          <Avatar className="w-[64px] h-[64px]">
            <AvatarImage src={""} alt="avatar" />
            <AvatarFallback>PO</AvatarFallback>
          </Avatar>
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <FileUpload
                required
                maxFiles={1}
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg"],
                }}
                maxSizeInMb={2}
                trigger={
                  <div className="space-y-2 -my-2 w-full">
                    <p className="text-p3 text-txt-tertiary">
                      <span className="text-txt-brand font-medium">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-p4 text-txt-tertiary">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </p>
                  </div>
                }
                parentClassName="w-full"
                validatormessage={errors.avatar?.message?.toString()}
                onChange={(files) => field.onChange(files)}
                hideProgress
              />
            )}
          />
        </section>

        <Input
          label="RC Number"
          name="rc_number"
          placeholder="RC 1234567r"
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
              disabled
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
          disabled
        />
        <Input
          label="Street name"
          name="street"
          placeholder="E.g, Ozumba Mbadiwe"
          validatormessage={errors.street?.message}
          required
          register={register}
          parentClassName="w-full"
          disabled
        />
        <Input
          label="City"
          name="city"
          placeholder="Enter name of city"
          validatormessage={errors.city?.message}
          required
          register={register}
          parentClassName="w-full"
          disabled
        />
      </form>
    </>
  );
};

export { CompanyInfoForm };
