"use client";
import { Button } from "@/components/ui/button";
import { Plus, Trash2Icon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { PencilIcon } from "@/assets/vectors/icons";
import {
  illiquidSubTypeOptions,
  liquidSubTypeOptions,
  privateTrustAssetTypeOptions,
} from "@/lib/constants";
import {
  PrivateTrustAssetForm,
  PrivateTrustAssetFormData,
} from "./private-trust-asset-form";

interface PrivateTrustAssetsProps {
  assets: PrivateTrustAssetFormData[];
  setAssets: Dispatch<SetStateAction<PrivateTrustAssetFormData[]>>;
  disabled: boolean;
}

export const PrivateTrustAssets = ({
  assets,
  setAssets,
  disabled,
}: PrivateTrustAssetsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<number | undefined>();

  const handleAddBeneficiary = (data: PrivateTrustAssetFormData) => {
    if (selected !== undefined) {
      setAssets((prev) =>
        prev.map((item, index) => (index === selected ? data : item))
      );
      setSelected(undefined);
    } else {
      setAssets((prev) => [...prev, data]);
    }
  };

  const handleRemove = (index: number) => {
    setAssets((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <PrivateTrustAssetForm
        initData={
          selected !== undefined && selected >= 0 ? assets[selected] : undefined
        }
        show={showModal}
        close={() => {
          setShowModal(false);
          setSelected(undefined);
        }}
        submit={handleAddBeneficiary}
      />
      <div className="border-b border-[#EEEFF1] py-6">
        {assets.length > 0 ? (
          <div className="grid gap-2 sm:gap-4 mb-6">
            {assets.map((item, index) => {
              const asset = privateTrustAssetTypeOptions.find(
                (option) => option.value === item.asset_type
              );
              const liquidSub = liquidSubTypeOptions.find(
                (option) => option.value === item.sub_type
              );
              const illiquidSub = illiquidSubTypeOptions.find(
                (option) => option.value === item.sub_type
              );

              const label =
                asset?.value === "liquid"
                  ? liquidSub?.label
                  : asset?.value === "illiquid"
                  ? illiquidSub?.label
                  : asset?.label;

              const sublabel =
                "currency" in item
                  ? item?.currency
                  : "instrument_type" in item
                  ? item?.instrument_type
                  : "state" in item
                  ? item?.state
                  : "company_name" in item
                  ? item?.company_name
                  : "name_of_asset" in item
                  ? item?.name_of_asset
                  : "intangible_asset_type" in item
                  ? item?.intangible_asset_type
                  : "";

              const value =
                "volume" in item
                  ? item?.volume
                  : "instrument_name" in item
                  ? item?.instrument_name
                  : "registration_number" in item
                  ? item?.registration_number
                  : "unit_of_shares" in item
                  ? item?.unit_of_shares
                  : "description_of_asset" in item
                  ? item?.description_of_asset
                  : "";

              return (
                <div
                  key={`beneficiary_${index}`}
                  className="flex items-center gap-4 bg-white border border-[#EEEFF1] rounded-[12px] p-3 sm:px-4 sm:py-6 shadow-sm"
                >
                  <div>
                    <p className="text-txt-tertiary text-xs mb-1">
                      {label} -{" "}
                      <span className="capitalize">
                        {sublabel.replaceAll("_", " ")}
                      </span>
                    </p>
                    <p className="text-primary font-medium">{value}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <Button
                      onClick={() => {
                        setSelected(index);
                        setShowModal(true);
                      }}
                      className="w-6 h-6"
                      variant={"outline"}
                      size={"icon"}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      onClick={() => handleRemove(index)}
                      className="w-6 h-6"
                      variant={"brand"}
                      size={"icon"}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
        <Button
          disabled={disabled}
          onClick={() => setShowModal(true)}
          variant={"secondary"}
          size={"sm"}
        >
          <Plus />
          Add Asset
        </Button>
      </div>
    </>
  );
};
