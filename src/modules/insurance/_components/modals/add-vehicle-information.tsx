"use client";

import { LoaderCircle, X } from "lucide-react";
import { Modal, ModalProps } from "@/components/modal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SelectInput } from "@/components/form/select-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/form/file-upload";
import { useParams } from "next/navigation";
import useInsuranceStore from "@/store/insurance";
import { useEffect, useMemo } from "react";
import { isValidPlateNumber, normalizePlateNumber } from "@/lib/insurance";
import { useLookupVehicle } from "@/requests/services/insurance/vehicle";
import { toast } from "sonner";
import { VehicleInfoData } from "@/types/insurance";
import { fileSchema } from "@/lib/file";

const formSchema = z.object({
  vehicleType: z.string().min(1, "Vehicle type is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  start_date: z.string().min(1, "Policy start date is required"),
  year: z
    .string()
    .min(4, "Enter a valid year")
    .max(4, "Enter a valid year")
    .regex(/^\d{4}$/, "Enter a valid year"),
  plateNumber: z
    .string()
    .min(1, "Plate number is required")
    .refine(isValidPlateNumber, "Enter a valid plate number (e.g. KJA-556-JA)"),
  chassisNumber: z.string().min(1, "Chassis number is required"),
  engineNumber: z.string().min(1, "Engine number is required"),
  color: z.string().min(1, "Color is required"),
  proofOfOwnership: fileSchema,
});

const editFormSchema = formSchema.extend({
  proofOfOwnership: z.any().optional(),
});

type AddVehicleInformationFormValues = z.infer<typeof formSchema>;
type AddVehicleInformationFormData = AddVehicleInformationFormValues & {
  useType: string;
};

const getProofOfOwnershipValue = (
  proofOfOwnership?: VehicleInfoData["proofOfOwnership"],
) => (proofOfOwnership ? [proofOfOwnership] : []);

interface AddVehicleInformationModalProps extends ModalProps {
  handleContinue: (data: AddVehicleInformationFormData) => void;
  initData?: Partial<VehicleInfoData> | null;
  requireProofOfOwnership?: boolean;
}

const AddVehicleInformationModal: React.FC<AddVehicleInformationModalProps> = ({
  handleContinue,
  initData,
  requireProofOfOwnership = true,
  ...props
}) => {
  const params = useParams<{ id: string }>();
  const rawUseType = Array.isArray(params.id) ? params.id[0] : params.id;
  const useType: "private" | "commercial" =
    initData?.useType === "private" || initData?.useType === "commercial"
      ? initData.useType
      : rawUseType === "private-motor"
        ? "private"
        : "commercial";
  const products = useInsuranceStore((state) => state.products);

  const vehicleTypeOptions = useMemo(() => {
    const vehicleTypes = products.third_party_motor_insurance[useType] ?? {};

    return Object.keys(vehicleTypes).map((vehicleType) => ({
      label: vehicleType,
      value: vehicleType,
    }));
  }, [products, useType]);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    control,
    setValue,
    getValues,
    reset,
  } = useForm<AddVehicleInformationFormValues>({
    resolver: zodResolver(
      requireProofOfOwnership ? formSchema : editFormSchema,
    ),
    mode: "onChange",
    defaultValues: {
      proofOfOwnership: [],
    },
  });

  useEffect(() => {
    if (initData) {
      reset({
        vehicleType: initData.vehicleType ?? "",
        make: initData.make ?? "",
        model: initData.model ?? "",
        start_date: initData.start_date ?? "",
        year: initData.year ?? "",
        plateNumber: initData.plateNumber ?? "",
        chassisNumber: initData.chassisNumber ?? "",
        engineNumber: initData.engineNumber ?? "",
        color: initData.color ?? "",
        proofOfOwnership: getProofOfOwnershipValue(initData.proofOfOwnership),
      });
      return;
    }

    reset({
      vehicleType: "",
      make: "",
      model: "",
      start_date: "",
      year: "",
      plateNumber: "",
      chassisNumber: "",
      engineNumber: "",
      color: "",
      proofOfOwnership: [],
    });
  }, [initData, reset, props.show]);

  const { mutate: lookupVehicle, isPending: isLookingUpVehicle } =
    useLookupVehicle({
      onSuccess: ({ data }) => {
        const prefillOptions = {
          shouldDirty: true,
          shouldValidate: true,
        };
        setValue("make", data.vehicleMake ?? "", prefillOptions);
        setValue("model", data.vehicleModel ?? "", prefillOptions);
        setValue("year", String(data.productionYear ?? ""), prefillOptions);
        setValue("chassisNumber", data.vinNumber ?? "", prefillOptions);
        setValue("engineNumber", data.engineNumber ?? "", prefillOptions);
        setValue("color", data.color ?? "", prefillOptions);
      },
      onError: () => {
        toast.error(
          "Could not find vehicle details for that plate. Please enter them manually.",
        );
      },
    });

  const onSubmit: SubmitHandler<AddVehicleInformationFormValues> = (data) => {
    handleContinue({
      ...data,
      plateNumber: normalizePlateNumber(data.plateNumber),
      useType,
      proofOfOwnership: data.proofOfOwnership?.[0],
    });
  };

  const handleVehicleLookup = () => {
    const raw = getValues("plateNumber") || "";
    const plateNumber = normalizePlateNumber(raw);

    if (!isValidPlateNumber(plateNumber)) return;

    if (plateNumber !== raw) {
      setValue("plateNumber", plateNumber, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    lookupVehicle(plateNumber);
  };

  return (
    <Modal
      {...props}
      contentClassName="px-4 py-6 md:px-10 md:pt-8 md:pb-10 max-w-[500px]"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-h4 font-medium text-txt-primary mb-1">
            Vehicle information
          </p>
          <p className="text-p3 text-txt-secondary">
            Enter the details of your vehicle
          </p>
        </div>
        <X role="button" onClick={props.close} />
      </div>

      <form className="space-y-4">
        <Input
          label="Policy start date"
          name="start_date"
          type="date"
          register={register}
          required
          validatormessage={errors.start_date?.message}
        />

        <Controller
          name="vehicleType"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Vehicle type"
              options={vehicleTypeOptions}
              required
              value={field.value}
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.vehicleType?.message}
              parentClassName="w-full"
              triggerClassName="bg-white"
              placeholder="Select vehicle type"
            />
          )}
        />

        <Input
          label="Plate number"
          name="plateNumber"
          register={register}
          placeholder="Enter plate number"
          required
          validatormessage={errors.plateNumber?.message}
          onBlur={handleVehicleLookup}
          endElement={
            isLookingUpVehicle ? (
              <LoaderCircle className="size-4 animate-spin text-txt-tertiary" />
            ) : undefined
          }
          endOffset="36px"
        />

        <Input
          label="Make"
          name="make"
          register={register}
          placeholder="Enter vehicle make"
          required
          validatormessage={errors.make?.message}
        />
        <Input
          label="Model"
          name="model"
          register={register}
          placeholder="Enter vehicle model"
          required
          validatormessage={errors.model?.message}
        />
        <Input
          label="Year"
          name="year"
          register={register}
          placeholder="YYYY"
          required
          maxLength={4}
          validatormessage={errors.year?.message}
        />

        <Input
          label="Chassis number"
          name="chassisNumber"
          register={register}
          placeholder="Enter chassis number"
          required
          validatormessage={errors.chassisNumber?.message}
        />
        <Input
          label="Engine number"
          name="engineNumber"
          register={register}
          placeholder="Enter engine number"
          required
          validatormessage={errors.engineNumber?.message}
        />
        <Input
          label="Color"
          name="color"
          register={register}
          placeholder="Enter vehicle color"
          required
          validatormessage={errors.color?.message}
        />

        <Controller
          name="proofOfOwnership"
          control={control}
          render={({ field }) => (
            <FileUpload
              {...field}
              label="Proof of ownership"
              required
              maxFiles={1}
              accept={{
                "image/*": [".png", ".jpg", ".jpeg"],
              }}
              maxSizeInMb={10}
              hint="Accepted documents: Vehicle licence or Proof of Ownership certificate."
              validatormessage={errors.proofOfOwnership?.message?.toString()}
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
            disabled={!isValid || isLookingUpVehicle}
            onClick={handleSubmit(onSubmit)}
          >
            Add &amp; Close
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { AddVehicleInformationModal };
