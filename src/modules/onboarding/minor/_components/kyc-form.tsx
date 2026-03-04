import React from "react";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/form/file-upload";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const fileSchema = z
  .any()
  .refine((files) => {
    if (!files || !files[0]) return false;
    return true;
  }, "This file is required")
  .refine((files) => {
    if (!files || !files[0]) return true;
    return files[0].size <= MAX_FILE_SIZE;
  }, "File size must be less than 10MB")
  .refine((files) => {
    if (!files || !files[0]) return true;
    return ACCEPTED_FILE_TYPES.includes(files[0].type);
  }, "Only .jpg, .jpeg, .png and .pdf files are accepted");

const formSchema = z.object({
  passport_photo: fileSchema,
  birth_cert: fileSchema,
});

export type KYCFormData = z.infer<typeof formSchema>;

interface KYCFormProps {
  submit: (data: KYCFormData) => void;
}

const KYCForm: React.FC<KYCFormProps> = ({ submit }) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,watch
  } = useForm<KYCFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<KYCFormData> = (data: KYCFormData) => {
    console.log("Form submitted:", data);
    submit(data);
  };

  console.log(watch())

  return (
    <>
      <form className="space-y-4">
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
                "application/pdf": [".pdf"],
              }}
              maxSizeInMb={2}
              validatormessage={errors.passport_photo?.message?.toString()}
              onChange={(files) => field.onChange(files)}
            />
          )}
        />
        <Controller
          name="birth_cert"
          control={control}
          render={({ field }) => (
            <FileUpload
              {...field}
              label="Birth certificate"
              required
              maxFiles={1}
              accept={{
                "image/*": [".png", ".jpg", ".jpeg"],
                "application/pdf": [".pdf"],
              }}
              maxSizeInMb={2}
              validatormessage={errors.birth_cert?.message?.toString()}
              onChange={(files) => field.onChange(files)}
            />
          )}
        />
        <Button
          className="w-full mt-8"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          Save and Continue
        </Button>
      </form>
    </>
  );
};

export { KYCForm };
