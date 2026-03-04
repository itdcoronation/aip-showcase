import React, { useEffect } from "react";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/form/file-upload";
import { fileSchema } from "@/lib/file";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/form/select-input";
import { identityTypeOptions } from "@/lib/constants";

const formSchema = z.object({
  identity_document_type: z.string({
    required_error: "Identity document type is required",
  }),
  identity_document_no: z.string({
    required_error: "Identity document number is required",
  }),
  passport_photo: fileSchema,
  proof_of_identity: fileSchema,
  proof_of_address: fileSchema,
  signature: fileSchema,
});

export type KYCFormData = z.infer<typeof formSchema>;

interface KYCFormProps {
  submit: (data: KYCFormData) => void;
  isPending?: boolean;
  initData?: KYCFormData;
}

const KYCForm: React.FC<KYCFormProps> = ({ submit, isPending, initData }) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    register,
    reset,
  } = useForm<KYCFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (initData) {
      reset(initData);
    }
  }, [initData]);

  const onSubmit: SubmitHandler<KYCFormData> = (data: KYCFormData) => {
    console.log("Form submitted:", data);
    submit(data);
  };

  return (
    <>
      <form className="space-y-4">
        <Controller
          name="identity_document_type"
          control={control}
          rules={{ required: "Document type is required" }}
          render={({ field }) => (
            <SelectInput
              label="Identity document type"
              options={identityTypeOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.identity_document_type?.message}
              value={field.value}
              parentClassName="w-full"
            />
          )}
        />
        <Input
          label="Identity document number"
          name="identity_document_no"
          register={register}
          placeholder="Enter your document number"
          required
          validatormessage={errors.identity_document_no?.message}
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
              maxSizeInMb={5}
              hint="Accepted documents: NIN slip, Int’ passport, or Driver’s license"
              validatormessage={errors.proof_of_identity?.message?.toString()}
              onChange={(files) => field.onChange(files)}
            />
          )}
        />
        <Controller
          name="passport_photo"
          control={control}
          render={({ field }) => (
            <FileUpload
              {...field}
              label="Passport photograph"
              required
              maxFiles={1}
              accept={{
                "image/*": [".png", ".jpg", ".jpeg"],
              }}
              maxSizeInMb={5}
              validatormessage={errors.passport_photo?.message?.toString()}
              onChange={(files) => {
                field.onChange(files);
              }}
              instructions="PNG or JPG (max. 5MB)"
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
              maxSizeInMb={5}
              hint="Accepted documents: Bank statement or Utility bills"
              validatormessage={errors.proof_of_address?.message?.toString()}
              onChange={(files) => field.onChange(files)}
            />
          )}
        />
        <Controller
          name="signature"
          control={control}
          render={({ field }) => (
            <FileUpload
              {...field}
              label="Signature"
              required
              maxFiles={1}
              accept={{
                "image/*": [".png", ".jpg", ".jpeg"],
                "application/pdf": [".pdf"],
              }}
              maxSizeInMb={5}
              validatormessage={errors.signature?.message?.toString()}
              onChange={(files) => field.onChange(files)}
            />
          )}
        />

        <Button
          className="w-full mt-8"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || isPending}
          loading={isPending}
        >
          Save and Continue
        </Button>
      </form>
    </>
  );
};

export { KYCForm };
