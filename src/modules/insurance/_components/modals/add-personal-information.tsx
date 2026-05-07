import { X } from "lucide-react";
import { Modal, ModalProps } from "@/components/modal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { startOfDay, subDays } from "date-fns";
import { SelectInput } from "@/components/form/select-input";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CustomPhoneInput } from "@/components/form/phone-input";
import { DatePicker } from "@/components/form/date-picker";
import { FileUpload } from "@/components/form/file-upload";
import { fileSchema } from "@/lib/file";
import { stateOptions, titleOptions } from "@/lib/constants";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phoneNumber: z.string().min(7, "Phone number is required"),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  houseNumber: z.string().min(1, "House number is required"),
  residentialAddress: z.string().min(1, "Residential address is required"),
  proofOfIdentity: fileSchema,
});

const editFormSchema = formSchema.extend({
  proofOfIdentity: z.any().optional(),
});

type AddPersonalInformationFormValues = z.infer<typeof formSchema>;

export interface AddPersonalInformationFormData {
  title: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  state: string;
  city: string;
  houseNumber: string;
  residentialAddress: string;
  proofOfIdentity?: File;
}

interface AddPersonalInformationModalProps extends ModalProps {
  handleContinue: (data: AddPersonalInformationFormData) => void;
  initData?: Partial<AddPersonalInformationFormData> | null;
  requireProofOfIdentity?: boolean;
}

const AddPersonalInformationModal: React.FC<
  AddPersonalInformationModalProps
> = ({
  handleContinue,
  initData,
  requireProofOfIdentity = true,
  ...props
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    control,
    reset,
  } = useForm<AddPersonalInformationFormValues>({
    resolver: zodResolver(
      requireProofOfIdentity ? formSchema : editFormSchema,
    ),
    mode: "onChange",
    defaultValues: {
      proofOfIdentity: [],
    },
  });

  useEffect(() => {
    if (initData) {
      reset({
        ...initData,
        title: initData.title ?? "",
        middleName: initData.middleName ?? "",
        state: initData.state ?? "",
        city: initData.city ?? "",
        houseNumber: initData.houseNumber ?? "",
        proofOfIdentity: initData.proofOfIdentity
          ? [initData.proofOfIdentity]
          : [],
      });
      return;
    }

    reset({
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: undefined,
      state: "",
      city: "",
      houseNumber: "",
      residentialAddress: "",
      proofOfIdentity: [],
    });
  }, [initData, reset, props.show]);

  const onSubmit: SubmitHandler<AddPersonalInformationFormValues> = (data) => {
    handleContinue({
      ...data,
      proofOfIdentity: data.proofOfIdentity?.[0],
    });
  };

  return (
    <Modal
      {...props}
      contentClassName="px-4 py-6 md:px-10 md:pt-8 md:pb-10 max-w-[500px]"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-h4 font-medium text-txt-primary mb-1">
            Personal information
          </p>
          <p className="text-p3 text-txt-secondary">
            Enter your personal details
          </p>
        </div>
        <X role="button" onClick={props.close} />
      </div>

      <form className="space-y-4">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Title"
              options={titleOptions}
              required
              value={field.value}
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.title?.message}
              parentClassName="w-full"
              triggerClassName="bg-white"
              placeholder="Select title"
            />
          )}
        />
        <Input
          label="First name"
          name="firstName"
          register={register}
          placeholder="Enter first name"
          required
          validatormessage={errors.firstName?.message}
        />
        <Input
          label="Middle name"
          name="middleName"
          register={register}
          placeholder="Enter middle name"
        />
        <Input
          label="Last name"
          name="lastName"
          register={register}
          placeholder="Enter last name"
          required
          validatormessage={errors.lastName?.message}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          register={register}
          placeholder="Enter email address"
          required
          validatormessage={errors.email?.message}
        />
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <CustomPhoneInput
              label="Phone number"
              required
              value={field.value}
              onChange={(phone) => field.onChange(phone)}
              validatormessage={errors.phoneNumber?.message}
            />
          )}
        />
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Date of birth"
              required
              value={field.value}
              handleChange={field.onChange}
              validatormessage={errors.dateOfBirth?.message}
              endMonth={subDays(new Date(), 1)}
              calendarDisabled={{ from: startOfDay(new Date()) }}
            />
          )}
        />
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="State"
              options={stateOptions}
              required
              value={field.value}
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.state?.message}
              parentClassName="w-full"
              triggerClassName="bg-white"
              placeholder="Select state"
            />
          )}
        />
        <Input
          label="City"
          name="city"
          register={register}
          placeholder="Enter city"
          required
          validatormessage={errors.city?.message}
        />
        <Input
          label="House number"
          name="houseNumber"
          register={register}
          placeholder="Enter house number"
          required
          validatormessage={errors.houseNumber?.message}
        />
        <Textarea
          label="Residential address"
          name="residentialAddress"
          register={register}
          placeholder="Enter your residential address"
          required
          rows={3}
          validatormessage={errors.residentialAddress?.message}
        />
        <Controller
          name="proofOfIdentity"
          control={control}
          render={({ field }) => (
            <FileUpload
              {...field}
              label="Identity document"
              required
              maxFiles={1}
              accept={{
                "image/*": [".png", ".jpg", ".jpeg"],
              }}
              maxSizeInMb={10}
              hint="Accepted documents: NIN slip, Int' passport, or Driver's license"
              validatormessage={errors.proofOfIdentity?.message?.toString()}
              onChange={(files) => field.onChange(files)}
              value={field.value}
            />
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EEEFF1]">
          <Button
            variant={"ghost"}
            size={"m"}
            type="button"
            onClick={props.close}
          >
            Cancel
          </Button>
          <Button
            size={"m"}
            disabled={!isValid}
            onClick={handleSubmit(onSubmit)}
          >
            Add &amp; Close
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { AddPersonalInformationModal };
