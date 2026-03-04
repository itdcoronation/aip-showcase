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
  cashAssetOptions,
  financialInstrumentTypeOptions,
  illiquidSubTypeOptions,
  intangibleAssetTypeOptions,
  lgaOptions,
  liquidSubTypeOptions,
  privateTrustAssetTypeOptions,
  stateOptions,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/form/date-picker";
import { FileUpload } from "@/components/form/file-upload";
import { fileSchema } from "@/lib/file";

// LIQUID: Cash asset
const cashAsset = z.object({
  asset_type: z.literal("liquid"),
  sub_type: z.literal("cash_asset"),
  currency: z.string().min(1, "Currency is required"),
  volume: z
    .string()
    .min(1, "This field is required")
    .regex(/^\d*\.?\d+$/, "Must be a number")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a valid number",
    })
    .refine((val) => Number(val) > 0, {
      message: "Must be positive",
    }),
});

// LIQUID: Financial Instrument - Bonds
const bonds = z.object({
  asset_type: z.literal("liquid"),
  sub_type: z.literal("financial_instrument"),
  instrument_type: z.literal("Bonds"),
  instrument_name: z.string().min(1, "Instrument name is required"),
  purchase_date: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Purchase date is required",
  }),
  maturity_period: z.string().min(1, "Maturity period is required"),
  coupon: z.string().min(1, "Coupon is required"),
});

// LIQUID: Financial Instrument - Treasury bill
const treasuryBill = z.object({
  asset_type: z.literal("liquid"),
  sub_type: z.literal("financial_instrument"),
  instrument_type: z.literal("Treasury bill"),
  instrument_name: z.string().min(1, "Instrument name is required"),
  purchase_date: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Purchase date is required",
  }),
  maturity_period: z.string().min(1, "Maturity period is required"),
});

// LIQUID: Financial Instrument - Mutual funds
const mutualFunds = z.object({
  asset_type: z.literal("liquid"),
  sub_type: z.literal("financial_instrument"),
  instrument_type: z.literal("Mutual funds"),
  instrument_name: z.string().min(1, "Instrument name is required"),
  value: z
    .string()
    .min(1, "This field is required")
    .regex(/^\d*\.?\d+$/, "Must be a number")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a valid number",
    })
    .refine((val) => Number(val) > 0, {
      message: "Must be positive",
    }),
});

// LIQUID: Financial Instrument - Others
const otherInstrument = z.object({
  asset_type: z.literal("liquid"),
  sub_type: z.literal("financial_instrument"),
  instrument_type: z.literal("Others"),
  instrument_name: z.string().min(1, "Instrument name is required"),
  purchase_date: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Purchase date is required",
  }),
  maturity_period: z.string().min(1, "Maturity period is required"),
  coupon: z.string().optional(),
});

// ILLIQUID: Land assets
const landAssets = z.object({
  asset_type: z.literal("illiquid"),
  sub_type: z.literal("land_assets"),
  registration_number: z.string().min(1, "Registration number is required"),
  state: z.string().min(1, "State is required"),
  lga: z.string().min(1, "LGA is required"),
  address: z.string().min(1, "Address is required"),
  description: z.string().min(1, "Description is required"),
  title_document: fileSchema,
});

// ILLIQUID: Shares
const shares = z.object({
  asset_type: z.literal("illiquid"),
  sub_type: z.literal("shares"),
  company_name: z.string().min(1, "Company name is required"),
  stock_broking_house: z.string().min(1, "Stock broking house is required"),
  clearing_house_number: z.string().min(1, "Clearing house number is required"),
  cscs_number: z.string().min(1, "CSCS number is required"),
  unit_of_shares: z
    .string()
    .min(1, "This field is required")
    .regex(/^\d*\.?\d+$/, "Must be a number")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a valid number",
    })
    .refine((val) => Number(val) > 0, {
      message: "Unit of shares must be positive",
    }),
});

// ILLIQUID: Luxury or Tangible personal assets
const luxuryAsset = z.object({
  asset_type: z.literal("illiquid"),
  sub_type: z.literal("luxury_or_tangible_personal_assets"),
  name_of_asset: z.string().min(1, "Name of asset is required"),
  description_of_asset: z.string().min(1, "Description of asset is required"),
});

// ILLIQUID: Intangible assets - Standard
const intangibleStandard = z.object({
  asset_type: z.literal("illiquid"),
  sub_type: z.literal("intangible_assets"),
  intangible_asset_type: z.enum([
    "royalties",
    "copyrights",
    "trademarks",
    "patents",
    "oil_gas_mineral_rights",
  ]),
  registration_number: z.string().min(1, "Registration number is required"),
  description: z.string().min(1, "Description is required"),
});

// ILLIQUID: Intangible assets - Others
const intangibleOther = z.object({
  asset_type: z.literal("illiquid"),
  sub_type: z.literal("intangible_assets"),
  intangible_asset_type: z.literal("others"),
  asset_name: z.string().min(1, "Asset name is required"),
  registration_number: z.string().min(1, "Registration number is required"),
  description: z.string().min(1, "Description is required"),
});

// FINAL FLATTENED SCHEMA
export const formSchema = z.union([
  cashAsset,
  bonds,
  treasuryBill,
  mutualFunds,
  otherInstrument,
  landAssets,
  shares,
  luxuryAsset,
  intangibleStandard,
  intangibleOther,
]);

export type PrivateTrustAssetFormData = z.infer<typeof formSchema>;

interface PrivateTrustAssetFormProps {
  show: boolean;
  close: () => void;
  submit: (data: PrivateTrustAssetFormData) => void;
  initData?: PrivateTrustAssetFormData;
}
export const PrivateTrustAssetForm = ({
  show,
  submit,
  initData,
  close,
}: PrivateTrustAssetFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    control,
    watch,
    reset,
  } = useForm<PrivateTrustAssetFormData>({
    resolver: zodResolver(formSchema),
    // mode: "onChange",
  });

  useEffect(() => {
    if (initData) reset(initData);
    else reset({});
  }, [initData]);

  const handleClose = () => {
    reset({});
    close();
  };

  const onSubmit: SubmitHandler<PrivateTrustAssetFormData> = (data) => {
    console.log("Form submitted:", data);
    submit(data);
    handleClose();
  };

  const onSubmitAddAnother: SubmitHandler<PrivateTrustAssetFormData> = (
    data
  ) => {
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
                options={privateTrustAssetTypeOptions}
                required
                onChange={(value) => field.onChange(value)}
                validatormessage={errors.asset_type?.message}
                value={field.value}
                placeholder="Select from the list"
              />
            )}
          />
          {watch("asset_type") ? (
            watch("asset_type") === "liquid" ? (
              <>
                <Controller
                  name="sub_type"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <SelectInput
                      label="Sub type"
                      options={liquidSubTypeOptions}
                      required
                      onChange={(value) => field.onChange(value)}
                      validatormessage={errors.sub_type?.message}
                      value={field.value}
                      placeholder="Select from the list"
                    />
                  )}
                />

                {watch("sub_type") === "cash_asset" ? (
                  <>
                    <Controller
                      name="currency"
                      control={control}
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <SelectInput
                          label="Currency"
                          options={cashAssetOptions}
                          required
                          onChange={(value) => field.onChange(value)}
                          validatormessage={
                            "currency" in errors
                              ? errors.currency?.message
                              : undefined
                          }
                          value={field.value}
                          placeholder="NGN (₦)"
                        />
                      )}
                    />
                    <Input
                      startElement={
                        <span className="text-[16px] text-txt-secondary leading-[20px]">
                          ₦
                        </span>
                      }
                      startOffset="32px"
                      type="number"
                      label="Volume"
                      name="volume"
                      placeholder="0.00"
                      validatormessage={
                        "volume" in errors ? errors.volume?.message : undefined
                      }
                      required
                      register={register}
                    />
                  </>
                ) : null}

                {watch("sub_type") === "financial_instrument" ? (
                  <>
                    <Controller
                      name="instrument_type"
                      control={control}
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <SelectInput
                          label="Instrument type"
                          options={financialInstrumentTypeOptions}
                          required
                          onChange={(value) => field.onChange(value)}
                          validatormessage={
                            "instrument_type" in errors
                              ? errors.instrument_type?.message
                              : undefined
                          }
                          value={field.value}
                          placeholder="Select from the list"
                        />
                      )}
                    />
                    <Input
                      label="Instrument name"
                      name="instrument_name"
                      placeholder="Enter the name of the instrument"
                      validatormessage={
                        "instrument_name" in errors
                          ? errors.instrument_name?.message
                          : undefined
                      }
                      required
                      register={register}
                    />
                    {watch("instrument_type") !== "Mutual funds" ? (
                      <Controller
                        name="purchase_date"
                        control={control}
                        rules={{ required: "Purchase date is required" }}
                        render={({ field }) => (
                          <DatePicker
                            label="Purchase date"
                            value={field.value as Date | undefined}
                            handleChange={(value) => field.onChange(value!)}
                            validatormessage={
                              "purchase_date" in errors
                                ? errors.purchase_date?.message
                                : undefined
                            }
                            required
                            parentClassName="w-full"
                            placeholder="dd/mm/yyyy"
                          />
                        )}
                      />
                    ) : null}
                    {watch("instrument_type") !== "Mutual funds" ? (
                      <Input
                        label="Maturity period"
                        name="maturity_period"
                        placeholder="e.g 1 year"
                        validatormessage={
                          "maturity_period" in errors
                            ? errors.maturity_period?.message
                            : undefined
                        }
                        required
                        register={register}
                      />
                    ) : null}
                    {watch("instrument_type") === "Bonds" ||
                    watch("instrument_type") === "Others" ? (
                      <Input
                        label={
                          watch("instrument_type") === "Bonds"
                            ? "Coupon"
                            : "Coupon (optional)"
                        }
                        name="coupon"
                        placeholder="Enter coupon amount"
                        validatormessage={
                          "coupon" in errors
                            ? errors.coupon?.message
                            : undefined
                        }
                        required={watch("instrument_type") === "Bonds"}
                        register={register}
                      />
                    ) : null}
                    {watch("instrument_type") === "Mutual funds" ? (
                      <Input
                        type="number"
                        label="Value"
                        name="value"
                        placeholder="e.g 200,000,000"
                        validatormessage={
                          "value" in errors ? errors.value?.message : undefined
                        }
                        required
                        register={register}
                      />
                    ) : null}
                  </>
                ) : null}
              </>
            ) : watch("asset_type") === "illiquid" ? (
              <>
                <Controller
                  name="sub_type"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <SelectInput
                      label="Sub type"
                      options={illiquidSubTypeOptions}
                      required
                      onChange={(value) => field.onChange(value)}
                      validatormessage={errors.sub_type?.message}
                      value={field.value}
                      placeholder="Select from the list"
                    />
                  )}
                />

                {watch("sub_type") === "land_assets" ? (
                  <>
                    <Input
                      label="Registration number"
                      name="registration_number"
                      placeholder="Enter land registration number"
                      validatormessage={
                        "registration_number" in errors
                          ? errors.registration_number?.message
                          : undefined
                      }
                      required
                      register={register}
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
                          validatormessage={
                            "state" in errors
                              ? errors.state?.message
                              : undefined
                          }
                          value={field.value}
                        />
                      )}
                    />
                    <Controller
                      name="lga"
                      control={control}
                      rules={{ required: "LGA is required" }}
                      render={({ field }) => (
                        <SelectInput
                          label="LGA"
                          options={lgaOptions}
                          required
                          onChange={(value) => field.onChange(value)}
                          validatormessage={
                            "lga" in errors ? errors.lga?.message : undefined
                          }
                          value={field.value}
                        />
                      )}
                    />
                    <Input
                      label="Address"
                      name="address"
                      placeholder="e.g 23 Kolawole street, off Adeola Odeku, VI, Lagos"
                      validatormessage={
                        "address" in errors
                          ? errors.address?.message
                          : undefined
                      }
                      required
                      register={register}
                    />
                    <Textarea
                      label="Description of asset"
                      name="description"
                      placeholder="Description of asset"
                      validatormessage={
                        "description" in errors
                          ? errors.description?.message
                          : undefined
                      }
                      required
                      register={register}
                    />
                    <Controller
                      name="title_document"
                      control={control}
                      render={({ field }) => (
                        <FileUpload
                          {...field}
                          label="Title document"
                          required
                          maxFiles={1}
                          accept={{
                            "image/*": [".png", ".jpg", ".jpeg"],
                            "application/pdf": [".pdf"],
                          }}
                          maxSizeInMb={10}
                          hint="Accepted documents: NIN slip, Int’ passport, or Driver’s license"
                          validatormessage={
                            "title_document" in errors
                              ? errors.title_document?.message?.toString()
                              : undefined
                          }
                          onChange={(files) => field.onChange(files)}
                        />
                      )}
                    />
                  </>
                ) : null}

                {watch("sub_type") === "shares" ? (
                  <>
                    <Input
                      label="Company name"
                      name="company_name"
                      placeholder="Enter name of company"
                      validatormessage={
                        "company_name" in errors
                          ? errors.company_name?.message
                          : undefined
                      }
                      required
                      register={register}
                    />
                    <Input
                      label="Stockbroking house"
                      name="stock_broking_house"
                      placeholder="Enter broking house"
                      validatormessage={
                        "stock_broking_house" in errors
                          ? errors.stock_broking_house?.message
                          : undefined
                      }
                      required
                      register={register}
                    />
                    <Input
                      label="Clearing House Number (CHN)"
                      name="clearing_house_number"
                      placeholder="Enter CHN"
                      validatormessage={
                        "clearing_house_number" in errors
                          ? errors.clearing_house_number?.message
                          : undefined
                      }
                      required
                      register={register}
                    />
                    <Input
                      label="CSCS number"
                      name="cscs_number"
                      placeholder="Enter CSCS number"
                      validatormessage={
                        "cscs_number" in errors
                          ? errors.cscs_number?.message
                          : undefined
                      }
                      required
                      register={register}
                    />
                    <Input
                      type="number"
                      label="Units of Shares"
                      name="unit_of_shares"
                      placeholder="e.g 2000"
                      validatormessage={
                        "unit_of_shares" in errors
                          ? errors.unit_of_shares?.message
                          : undefined
                      }
                      required
                      register={register}
                    />
                  </>
                ) : null}

                {watch("sub_type") === "luxury_or_tangible_personal_assets" ? (
                  <>
                    <Input
                      label="Name of asset"
                      name="name_of_asset"
                      placeholder="What is the name of this asset"
                      validatormessage={
                        "name_of_asset" in errors
                          ? errors.name_of_asset?.message
                          : undefined
                      }
                      required
                      register={register}
                    />
                    <Textarea
                      label="Description of asset"
                      name="description_of_asset"
                      placeholder="Description of asset"
                      validatormessage={
                        "description_of_asset" in errors
                          ? errors.description_of_asset?.message
                          : undefined
                      }
                      required
                      register={register}
                      hint="Include detailed description e.g color, size, specifications, etc."
                    />
                  </>
                ) : null}

                {watch("sub_type") === "intangible_assets" ? (
                  <>
                    <Controller
                      name="intangible_asset_type"
                      control={control}
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <SelectInput
                          label="Intangible asset type"
                          options={intangibleAssetTypeOptions}
                          required
                          onChange={(value) => field.onChange(value)}
                          validatormessage={
                            "intangible_asset_type" in errors
                              ? errors.intangible_asset_type?.message
                              : undefined
                          }
                          value={field.value}
                          placeholder="Select from the list"
                        />
                      )}
                    />
                    {watch("intangible_asset_type") === "others" ? (
                      <Input
                        label="Asset name"
                        name="asset_name"
                        placeholder="Enter name"
                        validatormessage={
                          "asset_name" in errors
                            ? errors.asset_name?.message
                            : undefined
                        }
                        required
                        register={register}
                      />
                    ) : null}
                    <Input
                      label="Registration number"
                      name="registration_number"
                      placeholder="Enter registration number"
                      validatormessage={
                        "registration_number" in errors
                          ? errors.registration_number?.message
                          : undefined
                      }
                      required
                      register={register}
                    />
                    <Textarea
                      label="Description of asset"
                      name="description_of_asset"
                      placeholder="Description of asset"
                      validatormessage={
                        "description_of_asset" in errors
                          ? errors.description_of_asset?.message
                          : undefined
                      }
                      required
                      register={register}
                      hint="Include detailed description e.g color, size, specifications, etc."
                    />
                  </>
                ) : null}
              </>
            ) : null
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
