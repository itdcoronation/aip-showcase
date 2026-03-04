import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomPhoneInput } from "@/components/form/phone-input";
import { SelectInput } from "@/components/form/select-input";
import { genderOptions, titleOptions, yesNoOptions } from "@/lib/constants";
import { DatePicker } from "@/components/form/date-picker";
import { imgSchema } from "@/lib/file";
import { nationalityOptions } from "@/constants/nationalities";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  email: z.string().email("Invalid email address"),
  bvn: z.string().min(11, "BVN must be at least 11 characters long"),
  phone: z.string().min(10, "Phone number must be at least 10 characters long"),
  alt_phone: z.string().optional(),
  first_name: z.string({ required_error: "First name is required" }),
  last_name: z.string({ required_error: "Last name is required" }),
  nationality: z.string({ required_error: "Nationality is required" }),
  // house_number: z.string({ required_error: "House number is required" }),
  street: z.string({ required_error: "Street is required" }),
  city: z.string({ required_error: "City is required" }),
  country: z.string({ required_error: "Country is required" }),
  lga: z.string({ required_error: "LGA is required" }),
  state_name: z.string({ required_error: "State is required" }),
  state: z.string({ required_error: "State is required" }),
  postal_code: z.string({ required_error: "Postal code is required" }),
  mother_maiden_name: z.string({
    required_error: "Mother's maiden name is required",
  }),
  gender: z.string({ required_error: "Gender is required" }),
  dispora_client: z.enum(["Yes", "No"]),
  other_names: z.string().optional(),
  dob: z.date({ required_error: "Date of birth is required" }),
  avatar: imgSchema,
});

export type PersonalInfoFormData = z.infer<typeof formSchema>;

interface PersonalInfoFormProps {
  initData?: Partial<PersonalInfoFormData>;
  formId?: string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
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
  } = useForm<PersonalInfoFormData>({
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
        className="space-y-4 flex-row flex-wrap flex justify-between"
      >
        {/* <section className="flex items-center gap-4 mb-8 w-full">
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
        </section> */}
        <Controller
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <SelectInput
              label="Title"
              options={titleOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.title?.message}
              value={field.value}
              parentClassName="w-full"
              disabled
            />
          )}
        />
        <Input
          label="First name"
          name="first_name"
          placeholder="Enter your first name"
          validatormessage={errors.first_name?.message}
          required
          register={register}
          parentClassName="w-full md:w-[48%]"
          disabled
        />
        <Input
          label="Last name"
          name="last_name"
          placeholder="Enter your last name"
          validatormessage={errors.last_name?.message}
          required
          register={register}
          parentClassName="w-full md:w-[48%]"
          disabled
        />
        <Input
          label="Other names (if you have)"
          name="other_names"
          placeholder="Enter your other names"
          validatormessage={errors.other_names?.message}
          register={register}
          parentClassName="w-full"
          disabled
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
          disabled
        />
        <Input
          label="BVN"
          name="bvn"
          placeholder="Enter your bank Verification Number"
          validatormessage={errors.bvn?.message}
          required
          register={register}
          parentClassName="w-full"
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
          parentClassName="w-full"
          disabled
        />
        <CustomPhoneInput
          label="Alternative phone number (Optional)"
          name="phone"
          placeholder="+1 (555) 000-0000"
          validatormessage={errors.alt_phone?.message}
          onChange={(phone) => {
            setValue("alt_phone", phone);
          }}
          value={watch("alt_phone")}
          parentClassName="w-full"
          disabled
        />
        <Controller
          name="nationality"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Nationality"
              options={nationalityOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.nationality?.message}
              value={field.value}
              parentClassName="w-full"
              disabled
            />
          )}
        />
        <Controller
          name="country"
          control={control}
          rules={{ required: "Country is required" }}
          render={({ field }) => (
            <SelectInput
              label="Country of residence"
              options={[{ label: field.value, value: field.value }]}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.country?.message}
              value={field.value}
              parentClassName="w-full md:w-[48%]"
              disabled
            />
          )}
        />
        <Controller
          name="state"
          control={control}
          rules={{ required: "State is required" }}
          render={({ field }) => (
            <SelectInput
              label="State of residence"
              options={[{ label: watch("state_name"), value: field.value }]}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.state?.message}
              value={field.value}
              parentClassName="w-full md:w-[48%]"
              disabled
            />
          )}
        />
        <Controller
          name="lga"
          control={control}
          rules={{ required: "LGA is required" }}
          render={({ field }) => (
            <SelectInput
              label="LGA of residence"
              options={[{ label: field.value, value: field.value }]}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.state?.message}
              value={field.value}
              parentClassName="w-full"
              disabled
            />
          )}
        />
        {/* <Input
          label="House number"
          name="house_number"
          placeholder="E.g, 123, 6, 74"
          validatormessage={errors.house_number?.message}
          required
          register={register}
          parentClassName="w-full"
          disabled
        /> */}
        <Input
          label="Permanent Address"
          name="street"
          placeholder="E.g, 12 Ozumba Mbadiwe Road, Victoria Island"
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
        <Input
          label="Postal code"
          name="postal_code"
          placeholder="E.g, 123456"
          validatormessage={errors.postal_code?.message}
          required
          register={register}
          parentClassName="w-full"
          disabled
        />
        {/* DOB */}
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
              disabled
            />
          )}
        />

        <Input
          label="Mother maiden name"
          name="mother_maiden_name"
          placeholder="Enter your mothers maiden name"
          validatormessage={errors.mother_maiden_name?.message}
          required
          register={register}
          parentClassName="w-full"
          disabled
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
              parentClassName="w-full md:w-[48%]"
              disabled
            />
          )}
        />
        <Controller
          name="dispora_client"
          control={control}
          rules={{ required: "Diaspora client is required" }}
          render={({ field }) => (
            <SelectInput
              label="Diaspora client"
              options={yesNoOptions}
              required
              onChange={(value) => field.onChange(value as "Yes" | "No")}
              validatormessage={errors.dispora_client?.message}
              value={field.value}
              parentClassName="w-full md:w-[48%]"
              disabled
            />
          )}
        />
      </form>
    </>
  );
};

export { PersonalInfoForm };
