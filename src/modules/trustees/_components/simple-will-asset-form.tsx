import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FormHeader } from "@/components/form/header";
import { Modal } from "@/components/modal";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/form/select-input";
import {
  accountTypeOptions,
  assetTypeOptions,
  pensionManagerOptions,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const bankAccountSchema = z.object({
  asset_type: z.literal("bank_account"),
  asset_data: z.object({
    account_type: z.string().min(1, "This field is required"),
    bank_name: z.string().min(1, "This field is required"),
    account_number: z.string().min(1, "This field is required"),
  }),
});

const rsaSchema = z.object({
  asset_type: z.literal("rsa"),
  asset_data: z.object({
    pension_manager: z.string().min(1, "This field is required"),
    rsa_number: z.string().min(1, "This field is required"),
  }),
});

const nfaSchema = z.object({
  asset_type: z.literal("nfa"),
  asset_data: z.object({
    asset_name: z.string().min(1, "This field is required"),
    asset_description: z.string().min(1, "This field is required"),
  }),
});

const formSchema = z.discriminatedUnion("asset_type", [
  bankAccountSchema,
  rsaSchema,
  nfaSchema,
]);

export type SimpleWillAssetFormData = z.infer<typeof formSchema>;

interface SimpleWillAssetFormProps {
  show: boolean;
  close: () => void;
  submit: (data: SimpleWillAssetFormData) => void;
  initData?: SimpleWillAssetFormData;
}
export const SimpleWillAssetForm = ({
  show,
  submit,
  initData,
  close,
}: SimpleWillAssetFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    control,
    watch,
    reset,
  } = useForm<SimpleWillAssetFormData>({
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

  const onSubmit: SubmitHandler<SimpleWillAssetFormData> = (data) => {
    console.log("Form submitted:", data);
    submit(data);
    handleClose();
  };

  const onSubmitAddAnother: SubmitHandler<SimpleWillAssetFormData> = (data) => {
    console.log("Form submitted:", data);
    submit(data);
    reset();
  };

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
          title="Add asset"
          description="Descriptor"
          titleType="h3"
          titleClassName="!font-medium"
        />
        <form className="space-y-4 -mt-4">
          <Controller
            name="asset_type"
            control={control}
            rules={{ required: "Required" }}
            render={({ field }) => (
              <SelectInput
                label="Asset type"
                options={assetTypeOptions}
                required
                onChange={(value) => field.onChange(value)}
                validatormessage={errors.asset_type?.message}
                value={field.value}
                placeholder="Select from the list"
                hint={watch("asset_type") === "nfa" ? "Asset should not be more than ₦ 500,000" : undefined}
              />
            )}
          />
          {watch("asset_type") === "bank_account" ? (
            <div className="space-y-4">
              <Controller
                name="asset_data.account_type"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <SelectInput
                    label="Account type"
                    options={accountTypeOptions}
                    required
                    onChange={(value) => field.onChange(value)}
                    validatormessage={
                      typeof errors.asset_data === "object" &&
                      "account_type" in errors.asset_data
                        ? (errors.asset_data as any).account_type?.message
                        : undefined
                    }
                    value={field.value}
                    placeholder="Savings"
                  />
                )}
              />
              <Controller
                name="asset_data.bank_name"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <SelectInput
                    label="Bank name"
                    options={assetTypeOptions}
                    required
                    onChange={(value) => field.onChange(value)}
                    validatormessage={
                      typeof errors.asset_data === "object" &&
                      "bank_name" in errors.asset_data
                        ? (errors.asset_data as any).bank_name?.message
                        : undefined
                    }
                    value={field.value}
                    placeholder="Select bank"
                  />
                )}
              />
              <Input
                label="Account number"
                name="asset_data.account_number"
                placeholder="Eg. 1234567890"
                validatormessage={
                  typeof errors.asset_data === "object" && "account_number" in errors.asset_data
                    ? (errors.asset_data as any).account_number?.message
                    : undefined
                }
                required
                register={register}
              />
            </div>
          ) : watch("asset_type") === "rsa" ? (
            <div className="space-y-4">
              <Controller
                name="asset_data.pension_manager"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <SelectInput
                    label="Pension manager"
                    options={pensionManagerOptions}
                    required
                    onChange={(value) => field.onChange(value)}
                    validatormessage={
                      typeof errors.asset_data === "object" &&
                      "pension_manager" in errors.asset_data
                        ? (errors.asset_data as any).pension_manager?.message
                        : undefined
                    }
                    value={field.value}
                    placeholder="Select from list"
                  />
                )}
              />
              <Input
                label="RSA number"
                name="asset_data.rsa_number"
                placeholder="Enter your Retirement Savings Number"
                validatormessage={
                  typeof errors.asset_data === "object" && "rsa_number" in errors.asset_data
                    ? (errors.asset_data as any).rsa_number?.message
                    : undefined
                }
                required
                register={register}
              />
            </div>
          ) : watch("asset_type") === "nfa" ? (
            <div className="space-y-4">
              <Input
                label="Name of asset"
                name="asset_data.asset_name"
                placeholder="What is the name of this asset"
                validatormessage={
                  typeof errors.asset_data === "object" && "asset_name" in errors.asset_data
                    ? (errors.asset_data as any).asset_name?.message
                    : undefined
                }
                required
                register={register}
              />
              <Textarea
              label="Description of asset"
                name="asset_data.asset_description"
                placeholder="Describe this asset"
                validatormessage={
                  typeof errors.asset_data === "object" && "asset_description" in errors.asset_data
                    ? (errors.asset_data as any).asset_description?.message
                    : undefined
                }
                required
                register={register}
                hint="Include detailed description e.g color, size, specifications, etc."
              />
            </div>
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
