import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { DatePicker } from "@/components/form/date-picker";
import { FileUpload } from "@/components/form/file-upload";
import { FormHeader } from "@/components/form/header";
import { Modal } from "@/components/modal";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/form/select-input";
import { beneficiaryRelationshipOptions, genderOptions } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { fileSchema } from "@/lib/file";

const formSchema = z
  .object({
    relationship: z.string().min(1, "Relationship is required"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    other_names: z.string().min(1, "Other names are required"),
    gender: z.string().min(1, "Gender is required"),
    dob: z.date({ required_error: "Date of birth is required" }),
    other_relationship: z.string().optional(),
    guardian_name: z.string().optional(),
    guardian_address: z.string().optional(),
    guardian_proof_of_identity: fileSchema,
  })
  .superRefine((data, ctx) => {
    if (data.relationship === "Other" && !data.other_relationship) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["other_relationship"],
        message: "Please specify your relationship",
      });
    }
    if (data.dob) {
      const today = new Date();
      const age =
        today.getFullYear() -
        data.dob.getFullYear() -
        (today.getMonth() < data.dob.getMonth() ||
        (today.getMonth() === data.dob.getMonth() &&
          today.getDate() < data.dob.getDate())
          ? 1
          : 0);

      if (age < 18) {
        if (!data.guardian_name || data.guardian_name.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["guardian_name"],
            message: "Guardian’s full name is required for minors",
          });
        }
        if (!data.guardian_address || data.guardian_address.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["guardian_address"],
            message: "Guardian’s residential address is required for minors",
          });
        }
      }
    }
  });

export type AddBeneficiaryFormData = z.infer<typeof formSchema>;

interface AddBeneficiaryFormProps {
  show: boolean;
  close: () => void;
  submit: (data: AddBeneficiaryFormData) => void;
  initData?: AddBeneficiaryFormData;
}
export const AddBeneficiaryForm = ({
  show,
  submit,
  initData,
  close,
}: AddBeneficiaryFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    control,
    watch,
    reset,
  } = useForm<AddBeneficiaryFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (initData) reset(initData);
    else reset({});
  }, [initData]);

  const handleClose = () => {
    reset({});
    close();
  };

  const onSubmit: SubmitHandler<AddBeneficiaryFormData> = (data) => {
    console.log("Form submitted:", data);
    submit(data);
    handleClose();
  };

  const onSubmitAddAnother: SubmitHandler<AddBeneficiaryFormData> = (data) => {
    console.log("Form submitted:", data);
    submit(data);
    reset();
  };

  const modalRef = useRef<HTMLElement>(null);

  const today = new Date();
  const age =
    watch("dob") &&
    today.getFullYear() -
      watch("dob").getFullYear() -
      (today.getMonth() < watch("dob").getMonth() ||
      (today.getMonth() === watch("dob").getMonth() &&
        today.getDate() < watch("dob").getDate())
        ? 1
        : 0);

  const needsGuardian = age < 18;
  return (
    <>
      <Modal
        contentClassName="p-4 sm:p-10 max-w-[500px] relative hide-scrollbar"
        show={show}
        close={handleClose}
      >
        <Button
          variant={"ghost"}
          size={"icon"}
          className="absolute right-8"
          onClick={handleClose}
        >
          <X className="!h-[20px] !w-[20px]" />
        </Button>
        <FormHeader
          title="Add a beneficiary"
          description="These could be your spouse, children or anyone you want to participate in this simple will"
          titleType="h3"
          titleClassName="!font-medium"
        />
        <form className="space-y-4 -mt-4">
          <Controller
            name="relationship"
            control={control}
            rules={{ required: "Required" }}
            render={({ field }) => (
              <SelectInput
                label="Relationship"
                options={beneficiaryRelationshipOptions}
                required
                onChange={(value) => field.onChange(value)}
                validatormessage={errors.relationship?.message}
                value={field.value}
                placeholder="Select from the list"
              />
            )}
          />
          {watch("relationship") === "Other" ? (
            <Input
              label="Other"
              name="other_relationship"
              placeholder="What is your relationship"
              validatormessage={errors.other_relationship?.message}
              register={register}
              required={watch("relationship") === "Other"}
            />
          ) : null}
          <Input
            label="First name"
            name="first_name"
            placeholder="Beneficiary first name"
            validatormessage={errors.first_name?.message}
            required
            register={register}
          />
          <Input
            label="Last name"
            name="last_name"
            placeholder="Beneficiary last name"
            validatormessage={errors.last_name?.message}
            required
            register={register}
          />
          <Input
            label="Other names"
            name="other_names"
            placeholder="Beneficiary other names"
            validatormessage={errors.other_names?.message}
            required
            register={register}
          />
          <Controller
            name="gender"
            control={control}
            rules={{ required: "Required" }}
            render={({ field }) => (
              <SelectInput
                label="Gender"
                options={genderOptions}
                required
                onChange={(value) => field.onChange(value)}
                validatormessage={errors.gender?.message}
                value={field.value}
                placeholder="Select from the list"
              />
            )}
          />
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
                parentContainer={modalRef.current ?? undefined}
              />
            )}
          />

          {needsGuardian ? (
            <>
              <Input
                label="Guardian’s full name"
                name="guardian_name"
                placeholder="Enter the full name of guardian"
                validatormessage={errors.guardian_name?.message}
                required
                register={register}
                parentClassName="w-full"
              />
              <Input
                label="Guardian’s residential address"
                name="guardian_address"
                placeholder="Eg. 24 Adeniran Ogunsanya, Surulere, Lagos"
                validatormessage={errors.guardian_address?.message}
                required
                register={register}
                parentClassName="w-full"
              />
              <Controller
                name="guardian_proof_of_identity"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    {...field}
                    label="Guardian’s means of identification"
                    required
                    maxFiles={1}
                    accept={{
                      "image/*": [".png", ".jpg", ".jpeg"],
                      "application/pdf": [".pdf"],
                    }}
                    maxSizeInMb={10}
                    hint="Accepted documents: NIN slip, Int’ passport, or Driver’s license"
                    validatormessage={errors.guardian_proof_of_identity?.message?.toString()}
                    onChange={(files) => field.onChange(files)}
                  />
                )}
              />
            </>
          ) : null}
          <div
            className={cn(
              "mt-8 space-y-2 w-full grid gap-2",
              initData ? "grid-cols-1" : "grid-cols-2"
            )}
          >
            {initData ? null : (
              <Button
                variant={"secondary"}
                className="w-full"
                onClick={handleSubmit(onSubmitAddAnother)}
                disabled={!isValid}
              >
                Save & Add Another
              </Button>
            )}
            <Button
              className="w-full"
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid}
            >
              {initData ? "Save & Close" : " Add & Close"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
