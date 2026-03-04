import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CustomPhoneInput } from "@/components/form/phone-input";
import { SelectInput } from "@/components/form/select-input";
import {
  countryOptions,
  genderOptions,
  titleOptions,
  yesNoOptions,
} from "@/lib/constants";
import { DatePicker } from "@/components/form/date-picker";
import { nationalityOptions } from "@/constants/nationalities";
import { useFetchLGAs } from "@/requests/services/utils/lgas";
import { useFetchStates } from "@/requests/services/utils/states";
import { FetchNextPageOptions } from "@tanstack/react-query";

export interface useInfiniteScrollProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: (options?: FetchNextPageOptions) => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  email: z.string().email("Invalid email address"),
  bvn: z.string().min(11, "BVN must be at least 11 characters long"),
  phone: z.string().min(10, "Phone number must be at least 10 characters long"),
  alt_phone: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  nationality: z.string().min(1, "Nationality is required"),
  // house_number: z.string({ required_error: "House number is required" }),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  lga: z.string().min(1, "LGA is required"),
  state_name: z.string().min(1, "State is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  mother_maiden_name: z.string().min(1, "Mother's maiden name is required"),
  gender: z.string().min(1, "Gender is required"),
  dispora_client: z.enum(["Yes", "No"]),
  other_names: z.string().optional(),
  dob: z.date({ required_error: "Date of birth is required" }),
});

export type PersonalInfoFormData = z.infer<typeof formSchema>;

interface PersonalInfoFormProps {
  submit: (data: PersonalInfoFormData) => void;
  initData?: Partial<PersonalInfoFormData>;
  handleBack?: () => void;
  formId?: string;
  key?: string;
  isPending?: boolean;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  submit,
  handleBack,
  initData,
  formId,
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
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const { data: statesData, isFetching: isFetchingStates } = useFetchStates({
    params: { page: 1, search: "", per_page: 36 },
  });

  const { data: lgaData, isLoading: isLoadingLgas } = useFetchLGAs({
    params: { state_code: watch("state") },
    options: { enabled: !!watch("state") },
  });

  const isIndividual = formId === "individual-personal-info";

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

  const lgaOptions =
    lgaData?.data.lgas.map((lga) => ({ label: lga, value: lga })) || [];

  const stateOptions =
    statesData?.data.map((state) => ({
      label: state.name,
      value: state.code,
    })) || [];

  return (
    <>
      <form
        key={key}
        className="space-y-4 flex-row flex-wrap flex justify-between"
      >
        <Input
          label="Email"
          name="email"
          type="email"
          register={register}
          placeholder="Enter your email address"
          required
          validatormessage={errors.email?.message}
          parentClassName="w-full"
          disabled={isIndividual}
        />
        <Input
          label="BVN"
          name="bvn"
          placeholder="Enter your bank Verification Number"
          validatormessage={errors.bvn?.message}
          required
          register={register}
          parentClassName="w-full"
          disabled={isIndividual}
        />
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
          disabled={isIndividual}
        />
        <Input
          label="Last name"
          name="last_name"
          placeholder="Enter your last name"
          validatormessage={errors.last_name?.message}
          required
          register={register}
          parentClassName="w-full md:w-[48%]"
          disabled={isIndividual}
        />
        <Input
          label="Other names (if you have)"
          name="other_names"
          placeholder="Enter your other names"
          validatormessage={errors.other_names?.message}
          register={register}
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
          disabled={isIndividual}
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
              options={countryOptions}
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
              options={stateOptions}
              required
              onChange={(value) => {
                setValue(
                  "state_name",
                  stateOptions.find((s) => s.value === value)?.label || ""
                );
                field.onChange(value);
              }}
              validatormessage={errors.state?.message}
              value={field.value}
              parentClassName="w-full md:w-[48%]"
              isLoading={isFetchingStates}
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
              options={lgaOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.lga?.message}
              value={field.value}
              parentClassName="w-full"
              isLoading={isLoadingLgas}
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
        /> */}
        <Input
          label="Permanent Address"
          name="street"
          placeholder="E.g, 12 Ozumba Mbadiwe Road, Victoria Island"
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
        <Input
          label="Postal code"
          name="postal_code"
          placeholder="E.g, 123456"
          validatormessage={errors.postal_code?.message}
          required
          register={register}
          parentClassName="w-full"
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
            />
          )}
        />
        {/* DOB */}
        <Input
          label="Mother maiden name"
          name="mother_maiden_name"
          placeholder="Enter your mothers maiden name"
          validatormessage={errors.mother_maiden_name?.message}
          required
          register={register}
          parentClassName="w-full"
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
            />
          )}
        />

        <div className="mt-8 space-y-2 w-full">
          <Button
            loading={isPending}
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isPending}
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
