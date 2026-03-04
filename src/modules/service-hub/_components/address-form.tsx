import { Input } from "@/components/ui/input";
import React from "react";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { FileUpload } from "@/components/form/file-upload";
import { SelectInput } from "@/components/form/select-input";
import { countryOptions, stateOptions } from "@/lib/constants";
import { fileSchema } from "@/lib/file";

const formSchema = z.object({
  house_number: z
    .string({ required_error: "House number is required" })
    .min(1, "House number is required"),
  street_name: z
    .string({ required_error: "Street name is required" })
    .min(1, "Street name is required"),
  city: z.string().min(1, "City is required"),
  country: z.string({ required_error: "Country is required" }),
  state: z.string({ required_error: "State is required" }),
  proof_of_address: fileSchema,
});

export type AccountAddressFormData = z.infer<typeof formSchema>;

const AccountAddressForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    control,
  } = useForm<AccountAddressFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<AccountAddressFormData> = (
    data: AccountAddressFormData
  ) => {
    console.log("Form submitted:", data);
  };

  return (
    <>
      <div className="mb-8 md:mb-10">
        <h2 className="font-semibold text-p2 md:text-h3 text-txt-primary mb-2">
          Address
        </h2>
        <p className="text-xs md:text-sm text-txt-tertiary">
          Update your current residential address
        </p>
      </div>
      <form className="space-y-6 flex-row flex-wrap flex justify-between">
        <Input
          label="Current address"
          placeholder="Current address"
          required
          parentClassName="w-full"
          disabled
          value={"12, Moshood Olugbani, VI, Lagos"}
        />
        <Input
          label="House number"
          name="house_number"
          placeholder="E.g, 123, 6, 74"
          validatormessage={errors.house_number?.message}
          required
          register={register}
          parentClassName="w-full md:w-[48%]"
        />
        <Input
          label="Street name"
          name="street_name"
          placeholder="E.g, Ozumba Mbadiwe"
          validatormessage={errors.street_name?.message}
          required
          register={register}
          parentClassName="w-full md:w-[48%]"
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
        <Controller
          name="country"
          control={control}
          rules={{ required: "Country is required" }}
          render={({ field }) => (
            <SelectInput
              label="Country"
              options={countryOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.country?.message}
              value={field.value}
              parentClassName="w-full md:w-[48%]"
            />
          )}
        />
        <Controller
          name="state"
          control={control}
          rules={{ required: "State is required" }}
          render={({ field }) => (
            <SelectInput
              label="State"
              options={stateOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.state?.message}
              value={field.value}
              parentClassName="w-full md:w-[48%]"
            />
          )}
        />
        <Controller
          name="proof_of_address"
          control={control}
          render={({ field }) => (
            <FileUpload
              {...field}
              label="Proof of address"
              required
              maxFiles={1}
              accept={{
                "image/*": [".png", ".jpg", ".jpeg"],
                "application/pdf": [".pdf"],
              }}
              maxSizeInMb={10}
              hint="Accepted documents: Bank statement or Utility bills"
              validatormessage={errors.proof_of_address?.message?.toString()}
              onChange={(files) => field.onChange(files)}
              parentClassName="w-full"
            />
          )}
        />
        <div className="mt-8 space-y-2 w-full">
          <Button
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
          >
            Send request <ChevronRight />
          </Button>
        </div>
      </form>
    </>
  );
};

export { AccountAddressForm };
