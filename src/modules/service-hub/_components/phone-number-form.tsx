import React from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { CustomPhoneInput } from "@/components/form/phone-input";

const formSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters long"),
});

export type AccountPhoneNumberFormData = z.infer<typeof formSchema>;

const AccountPhoneNumberForm = () => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<AccountPhoneNumberFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<AccountPhoneNumberFormData> = (
    data: AccountPhoneNumberFormData
  ) => {
    console.log("Form submitted:", data);
  };

  return (
    <>
      <div className="mb-8 md:mb-10">
        <h2 className="font-semibold text-p2 md:text-h3 text-txt-primary mb-2">
          Phone number
        </h2>
        <p className="text-xs md:text-sm text-txt-tertiary">Update your phone number </p>
      </div>
      <form className="space-y-6 flex-row flex-wrap flex justify-between">
        <CustomPhoneInput
          label="Current phone number"
          placeholder="+1 (555) 000-0000"
          required
          value={"+2348179661241"}
          parentClassName="w-full"
          disabled
        />
        <CustomPhoneInput
          label="Enter new phone number"
          name="phone"
          placeholder="+1 (555) 000-0000"
          validatormessage={errors.phone?.message}
          required
          onChange={(phone) => {
            setValue("phone", phone, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
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
            Send request <ChevronRight />
          </Button>
        </div>
      </form>
    </>
  );
};

export { AccountPhoneNumberForm };
