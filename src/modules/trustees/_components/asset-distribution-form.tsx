import { z } from "zod";
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { FormHeader } from "@/components/form/header";
import { Modal } from "@/components/modal";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/form/select-input";
import { cn } from "@/lib/utils";
import { optionType } from "@/types/util";

const distributionSchema = z.object({
  beneficiary: z.string().min(1, "This field is required"),
  beneficiary_share: z
    .string()
    .min(1, "This field is required")
    .regex(/^\d*\.?\d+$/, "Must be a number")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a valid number",
    })
    .refine((val) => Number(val) >= 0.01 && Number(val) <= 100, {
      message: "Share must be between 0.01 and 100",
    }),
});

const formSchema = z
  .object({
    asset: z.string().min(1, "This field is required"),
    beneficiaries: z
      .array(distributionSchema)
      .min(1, "At least one beneficiary is required"),
  })
  .superRefine((data, ctx) => {
    const totalShare = data.beneficiaries.reduce(
      (sum, b) => sum + Number(b.beneficiary_share),
      0
    );

    if (totalShare !== 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Asset distribution does not equal 100 %.`,
        path: ["beneficiaries"],
      });
    }

    // Check for duplicate beneficiaries
    const seen = new Set<string>();
    data.beneficiaries.forEach((b, idx) => {
      if (seen.has(b.beneficiary)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A beneficiary cannot be selected more than once.",
          path: ["beneficiaries", idx, "beneficiary"],
        });
      }
      seen.add(b.beneficiary);
    });
  });

export type AssetDistributionFormData = z.infer<typeof formSchema>;

interface AssetDistributionFormProps {
  show: boolean;
  close: () => void;
  submit: (data: AssetDistributionFormData) => void;
  initData?: AssetDistributionFormData;
  assetOptions: optionType[];
  beneficiaryOptions: optionType[];
}
export const AssetDistributionForm = ({
  show,
  submit,
  initData,
  close,
  assetOptions,
  beneficiaryOptions,
}: AssetDistributionFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    control,
    watch,
    reset,
  } = useForm<AssetDistributionFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "beneficiaries",
  });

  useEffect(() => {
    if (initData) reset(initData);
    else reset({});
  }, [initData]);

  console.log(errors, "errors");

  const handleClose = () => {
    reset({});
    close();
  };

  const onSubmit: SubmitHandler<AssetDistributionFormData> = (data) => {
    console.log("Form submitted:", data);
    submit(data);
    handleClose();
  };

  const onSubmitAddAnother: SubmitHandler<AssetDistributionFormData> = (
    data
  ) => {
    console.log("Form submitted:", data);
    submit(data);
    reset({asset: "", beneficiaries: []});
  };

  const totalShare = watch("beneficiaries")?.reduce(
    (sum, b) => sum + Number(b.beneficiary_share),
    0
  );

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
          title="Asset distribution"
          description="Descriptor"
          titleType="h3"
          titleClassName="!font-medium"
        />
        <form className="space-y-4 -mt-4">
          <div>
            <Controller
              name="asset"
              control={control}
              rules={{ required: "Required" }}
              render={({ field }) => (
                <SelectInput
                  label="Select asset"
                  options={assetOptions}
                  required
                  onChange={(value) => {
                    field.onChange(value);
                    if (fields.length === 0)
                      append({ beneficiary: "", beneficiary_share: "" });
                  }}
                  validatormessage={errors.asset?.message}
                  value={field.value}
                  placeholder="Select from the list"
                />
              )}
            />
            {errors.beneficiaries?.message ? (
              <small className="block mt-1 text-txt-danger text-xs">
                {errors.beneficiaries?.message}
              </small>
            ) : null}
          </div>
          {fields.map((field, index) => (
            <div className="space-y-4" key={field.id}>
              {fields.length !== 1 ? (
                <Button
                  variant={"ghost"}
                  size="icon"
                  className="ml-auto flex -mb-2 w-5 h-5"
                  onClick={(e) => {
                    e.preventDefault();
                    remove(index);
                  }}
                >
                  <X
                    size={20}
                    className="w-[20px] h-[20px] min-w-[20px] min-h-[20px]"
                  />
                </Button>
              ) : null}
              <Controller
                name={`beneficiaries.${index}.beneficiary`}
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <SelectInput
                    label="Select beneficiary"
                    options={beneficiaryOptions}
                    required
                    onChange={(value) => field.onChange(value)}
                    validatormessage={
                      errors.beneficiaries?.[index]?.beneficiary?.message
                    }
                    value={field.value}
                    placeholder="Select beneficiary"
                  />
                )}
              />
              <Input
                startElement={
                  <span className="text-txt-secondary text-[16px]">%</span>
                }
                startOffset="40px"
                label="Beneficiary share %"
                name={`beneficiaries.${index}.beneficiary_share`}
                placeholder="Enter a percentage e.g 85"
                validatormessage={
                  errors.beneficiaries?.[index]?.beneficiary_share?.message
                }
                required
                register={register}
                min={0}
                max={100}
                type="number"
              />
            </div>
          ))}
          {fields.length > 0 ? (
            <Button
              disabled={totalShare === 100}
              onClick={(e) => {
                e.preventDefault();
                append({ beneficiary: "", beneficiary_share: "" });
              }}
              className="ml-auto flex"
              variant={"ghost"}
              size="sm"
            >
              <Plus /> Add more
            </Button>
          ) : null}

          <div>
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
            {fields.length > 0 ? (
              <p className="text-xs text-txt-tertiary text-center mt-1">
                Beneficiary share must equate to 100%
              </p>
            ) : null}
          </div>
        </form>
      </Modal>
    </>
  );
};
