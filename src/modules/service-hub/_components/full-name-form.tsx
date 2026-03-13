import { Input } from "@/components/ui/input";
import React from "react";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { FileUpload } from "@/components/form/file-upload";
import { fileSchema } from "@/lib/file";

const formSchema = z.object({
  first_name: z
    .string({ required_error: "First name is required" })
    .min(1, "First name is required"),
  last_name: z
    .string({ required_error: "Last name is required" })
    .min(1, "Last name is required"),
  other_names: z.string().optional(),
  proof_of_identity: fileSchema,
});

export type AccountFullNameFormData = z.infer<typeof formSchema>;

const AccountFullNameForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    control,
  } = useForm<AccountFullNameFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<AccountFullNameFormData> = (
    data: AccountFullNameFormData
  ) => {
    console.log("Form submitted:", data);
  };

  return (
    <>
      <div className="mb-8 md:mb-10">
        <h2 className="font-semibold text-p2 md:text-h3 text-txt-primary mb-2">
          Full name
        </h2>
        <p className="text-xs md:text-sm text-txt-tertiary">
          Update your name, if you recently had a change of name
        </p>
      </div>
      <form className="space-y-6 flex-row flex-wrap flex justify-between">
        <Input
          label="Current name"
          placeholder="Current name"
          required
          parentClassName="w-full"
          disabled
          value={"Mercy Nweke"}
        />
        <Input
          label="First Name"
          name="first_name"
          placeholder="Enter new first name"
          validatormessage={errors.first_name?.message}
          required
          register={register}
          parentClassName="w-full md:w-[48%]"
        />
        <Input
          label="Last Name"
          name="last_name"
          placeholder="Enter new last name"
          validatormessage={errors.last_name?.message}
          required
          register={register}
          parentClassName="w-full md:w-[48%]"
        />
        <Input
          label="Other Names (if any)"
          name="other_names"
          placeholder="Enter your other names"
          validatormessage={errors.other_names?.message}
          register={register}
          parentClassName="w-full"
        />
        <Controller
          name="proof_of_identity"
          control={control}
          render={({ field }) => (
            <FileUpload
              {...field}
              label="Identity document"
              required
              maxFiles={1}
              accept={{
                "image/*": [".png", ".jpg", ".jpeg"],
                "application/pdf": [".pdf"],
              }}
              maxSizeInMb={10}
              hint="Accepted documents: NIN slip, Int’ passport, or Driver’s license"
              validatormessage={errors.proof_of_identity?.message?.toString()}
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

export { AccountFullNameForm };
