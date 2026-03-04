"use client";
import { Button } from "@/components/ui/button";
import { Plus, Trash2Icon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { PencilIcon } from "@/assets/vectors/icons";
import {
  SimpleWillAssetForm,
  SimpleWillAssetFormData,
} from "./simple-will-asset-form";
import { assetTypeOptions } from "@/lib/constants";

interface SimpleWillAssetsProps {
  assets: SimpleWillAssetFormData[];
  setAssets: Dispatch<SetStateAction<SimpleWillAssetFormData[]>>;
  disabled: boolean;
}

export const SimpleWillAssets = ({
  assets,
  setAssets,
  disabled,
}: SimpleWillAssetsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<number | undefined>();

  const handleAddBeneficiary = (data: SimpleWillAssetFormData) => {
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
      <SimpleWillAssetForm
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
              const asset = assetTypeOptions.find(
                (option) => option.value === item.asset_type
              );
              return (
                <div
                  key={`beneficiary_${index}`}
                  className="flex items-center gap-4 bg-white border border-[#EEEFF1] rounded-[12px] p-3 sm:px-4 sm:py-6 shadow-sm"
                >
                  <div>
                    <p className="text-txt-tertiary text-xs mb-1">
                      {asset?.label}
                    </p>
                    <p className="text-primary font-medium">
                      {"account_number" in item.asset_data
                        ? item.asset_data.account_number
                        : "rsa_number" in item.asset_data
                        ? item.asset_data.rsa_number
                        : "asset_description" in item.asset_data
                        ? item.asset_data.asset_description
                        : ""}
                    </p>
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
