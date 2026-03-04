import React from "react";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/form/file-upload";
import { fileSchema } from "@/lib/file";

const formSchema = z.object({
  cert_of_inc: fileSchema,
  board_resolution: fileSchema,
  memart: fileSchema,
  form_cac7: fileSchema,
  form_cac2: fileSchema,
  proof_of_address: fileSchema,
});

export type KYBFormData = z.infer<typeof formSchema>;

interface KYBFormProps {
  submit: (data: KYBFormData) => void;
}

const KYBForm: React.FC<KYBFormProps> = ({ submit }) => {
  const {
    handleSubmit,
    formState: { isValid, errors },
    control,
  } = useForm<KYBFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<KYBFormData> = (data: KYBFormData) => {
    console.log("Form submitted:", data);
    submit(data);
  };

  return (
    <>
      <form className="space-y-4">
        <Controller
          name="cert_of_inc"
          control={control}
          render={({ field }) => (
            <FileUpload
              {...field}
              label="Certificate of incorporation"
              required
              maxFiles={1}
              accept={{
                "image/*": [".png", ".jpg", ".jpeg"],
                "application/pdf": [".pdf"],
              }}
              maxSizeInMb={2}
              validatormessage={errors.cert_of_inc?.message?.toString()}
              onChange={(files) => {
                field.onChange(files);
              }}
            />
          )}
        />
        <Controller
          name="board_resolution"
          control={control}
          render={({ field }) => (
            <FileUpload
              {...field}
              label="Board resolution"
              required
              maxFiles={1}
              accept={{
                "image/*": [".png", ".jpg", ".jpeg"],
                "application/pdf": [".pdf"],
              }}
              maxSizeInMb={2}
              validatormessage={errors.board_resolution?.message?.toString()}
              onChange={(files) => field.onChange(files)}
            />
          )}
        />
        <Controller
          name="memart"
          control={control}
          render={({ field }) => (
            <FileUpload
              {...field}
              label="Memorandum and Articles of Association (MEMART)"
              required
              maxFiles={1}
              accept={{
                "image/*": [".png", ".jpg", ".jpeg"],
                "application/pdf": [".pdf"],
              }}
              maxSizeInMb={2}
              validatormessage={errors.memart?.message?.toString()}
              onChange={(files) => field.onChange(files)}
            />
          )}
        />
        <Controller
          name="form_cac7"
          control={control}
          render={({ field }) => (
            <FileUpload
              {...field}
              label="Particulars of Directors (Form CAC7)"
              required
              maxFiles={1}
              accept={{
                "image/*": [".png", ".jpg", ".jpeg"],
                "application/pdf": [".pdf"],
              }}
              maxSizeInMb={2}
              validatormessage={errors.form_cac7?.message?.toString()}
              onChange={(files) => field.onChange(files)}
            />
          )}
        />
        <Controller
          name="form_cac2"
          control={control}
          render={({ field }) => (
            <FileUpload
              {...field}
              label="Particulars of Shareholders (Form CAC2)"
              required
              maxFiles={1}
              accept={{
                "image/*": [".png", ".jpg", ".jpeg"],
                "application/pdf": [".pdf"],
              }}
              maxSizeInMb={2}
              validatormessage={errors.form_cac2?.message?.toString()}
              onChange={(files) => field.onChange(files)}
            />
          )}
        />
        <Controller
          name="proof_of_address"
          control={control}
          render={({ field }) => (
            <FileUpload
              {...field}
              label="Proof of operating address"
              required
              maxFiles={1}
              accept={{
                "image/*": [".png", ".jpg", ".jpeg"],
                "application/pdf": [".pdf"],
              }}
              maxSizeInMb={2}
              validatormessage={errors.proof_of_address?.message?.toString()}
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

export { KYBForm };
