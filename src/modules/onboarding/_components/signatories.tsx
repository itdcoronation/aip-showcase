import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon, X } from "lucide-react";
import { DatePicker } from "@/components/form/date-picker";
import { CustomPhoneInput } from "@/components/form/phone-input";
import { FormHeader } from "@/components/form/header";
import { Modal, ModalProps } from "@/components/modal";
import { PencilIcon } from "@/assets/vectors/icons";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/form/file-upload";
import { fileSchema } from "@/lib/file";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  bvn: z.string().min(11, "BVN must be at least 11 characters long"),
  dob: z.date({ required_error: "Date of birth is required" }),
  tin: z.string({ required_error: "Tax number is required" }),
  phone: z.string().min(10, "Phone number must be at least 10 characters long"),
  address: z.string({ required_error: "Address is required" }),
  proof_of_identity: fileSchema,
  passport_photo: fileSchema,
  proof_of_address: fileSchema,
});

export interface SignatoryInfoData extends SignatoriesFormData {
  full_name: string;
}

export type SignatoriesFormData = z.infer<typeof formSchema>;

interface SignatoriesFormProps {
  submit: (data: SignatoryInfoData[]) => void;
  key?: string;
  initData?: SignatoryInfoData[];
  handleBack?: () => void;
}

const SignatoriesForm: React.FC<SignatoriesFormProps> = ({
  submit,
  key,
  initData,
  handleBack,
}) => {
  const [selected, setSelected] = useState<number | undefined>();
  const [signatories, setSignatories] = useState<SignatoryInfoData[]>([]);
  const [showModal, setShowModal] = useState(false);

  const {
    formState: { isValid },
  } = useForm<SignatoriesFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (initData) setSignatories(initData);
  }, [initData]);

  const handleSave = (data: SignatoryInfoData) => {
    console.log("Form submitted:", data);
    if (selected !== undefined) {
      signatories[selected] = data;
      setSignatories([...signatories]);
      setSelected(undefined);
    } else {
      setSignatories((prev) => [...prev, data]);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", signatories);
    submit(signatories);
  };

  const handleRemove = (index: number) => {
    setSignatories((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <section key={key} className="space-y-4">
        <Signatory
          initData={
            selected !== undefined && selected >= 0
              ? signatories[selected]
              : undefined
          }
          submit={handleSave}
          show={showModal}
          close={() => {
            setShowModal(false);
            setSelected(undefined);
          }}
        />
        <Button
          variant={"ghost"}
          className="h-[32px]"
          onClick={() => setShowModal(true)}
        >
          <PlusIcon />
          Add a new signatory
        </Button>
        {signatories.map(({ bvn, full_name, email }, index) => (
          <div
            key={`bank-info-${index}`}
            className="relative space-y-3 border border-dashed border-stroke-brand p-4 rounded-[8px] bg-bg-brand-light"
          >
            <div className="flex items-center gap-2 absolute right-4 top-2">
              <Button
                variant={"ghost"}
                size={"icon"}
                className="h-[28px] w-[28px]"
                onClick={() => {
                  setSelected(index);
                  setShowModal(true);
                }}
              >
                <PencilIcon />
              </Button>

              <Button
                variant={"brand"}
                size={"icon"}
                className="h-[28px] w-[28px]"
                onClick={() => handleRemove(index)}
              >
                <Trash2Icon />
              </Button>
            </div>

            <div className="space-y-1">
              <p className="text-txt-secondary text-l3">BVN</p>
              <p className="text-txt-primary text-p3">{bvn}</p>
            </div>
            <div className="space-y-1">
              <p className="text-txt-secondary text-l3">Full Name</p>
              <p className="text-txt-primary text-p3">{full_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-txt-secondary text-l3">Email</p>
              <p className="text-txt-primary text-p3">{email}</p>
            </div>
          </div>
        ))}

        <div className="mt-8 space-y-2 w-full">
          <Button
            className="w-full"
            onClick={onSubmit}
            disabled={!isValid && signatories.length === 0}
          >
            Save and Continue
          </Button>
          {handleBack ? (
            <Button variant="secondary" className="w-full" onClick={handleBack}>
              Go back
            </Button>
          ) : null}
        </div>
      </section>
    </>
  );
};

export { SignatoriesForm };

interface SignatoryProps extends ModalProps {
  submit: (data: SignatoryInfoData) => void;
  key?: string;
  initData?: SignatoryInfoData;
}

const Signatory: React.FC<SignatoryProps> = ({
  submit,
  key,
  initData,
  close,
  show,
}) => {
  const [accountName, setAccountName] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    control,
    watch,
    reset,
    setValue,
  } = useForm<SignatoriesFormData>({
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

  const onSubmit: SubmitHandler<SignatoriesFormData> = (data) => {
    console.log("Form submitted:", data);
    submit({ ...data, full_name: accountName });
    handleClose();
  };

  const modalRef = useRef<HTMLElement>(null);

  return (
    <>
      <Modal
        contentClassName="p-4 sm:p-10 max-w-[500px] relative"
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
          title="Add a new signatory"
          description="You can add up to 3 signatories to your account"
          titleType="h2"
          titleClassName="!font-medium"
        />
        <form key={key} className="space-y-4">
          <Input
            label="BVN"
            name="bvn"
            placeholder="Enter your bank Verification Number"
            validatormessage={errors.bvn?.message}
            required
            register={register}
            parentClassName="w-full"
            onChange={(e) => {
              if (e.target.value.length === 10) {
                setAccountName("Philip Olorunfemi Ofei");
              }
            }}
            hint={
              watch("bvn")?.length === 11
                ? !!accountName
                  ? accountName
                  : "Account not found"
                : undefined
            }
            hintClassName={cn(
              "text-p4 flex items-center gap-1",
              !!accountName ? "text-txt-success" : "text-txt-danger"
            )}
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
          <Input
            label="TIN"
            name="tin"
            register={register}
            placeholder="Enter tax identification number"
            required
            validatormessage={errors.tin?.message}
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
          />
          <Input
            label="Residential address"
            name="address"
            placeholder="Eg. 23 bank Anthony Road, Ikeja, Lagos"
            validatormessage={errors.address?.message}
            required
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
                  "application/pdf": [".pdf"],
                }}
                maxSizeInMb={2}
                validatormessage={errors.passport_photo?.message?.toString()}
                onChange={(files) => {
                  field.onChange(files);
                }}
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
              />
            )}
          />
          <div className="mt-8 space-y-2 w-full">
            <Button
              className="w-full"
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid}
            >
              Add
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
